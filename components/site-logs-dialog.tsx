"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertCircle, ExternalLink, Camera, BarChart3 } from "lucide-react"
import { useSites } from "@/hooks/use-sites"
import { useToast } from "@/hooks/use-toast"
import type { ScrapeLogRead, Snapshot } from "@/types/site"
import { SiteService } from "@/services/site-service"

interface SiteLogsDialogProps {
  siteId: number | null
  siteName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SiteStats {
  total_runs: number
  successful_runs: number
  failed_runs: number
  last_run: string | null
  success_rate: number
}

export function SiteLogsDialog({ siteId, siteName, open, onOpenChange }: SiteLogsDialogProps) {
  const [logs, setLogs] = useState<ScrapeLogRead[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [snapshotsLoading, setSnapshotsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"logs" | "snapshots" | "stats">("logs")
  const { getSiteLogs } = useSites()
  const { toast } = useToast()

  const fetchLogs = async () => {
    if (!siteId) return

    setLoading(true)
    setError(null)
    try {
      const data = await getSiteLogs(siteId)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar logs")
      toast({
        title: "Erro",
        description: "Falha ao carregar logs do site",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSnapshots = async () => {
    if (!siteId) return

    setSnapshotsLoading(true)
    try {
      const data = await SiteService.getSnapshots(siteId)
      setSnapshots(data)
    } catch (err) {
      console.error("Error fetching snapshots:", err)
      toast({
        title: "Erro",
        description: "Falha ao carregar snapshots",
        variant: "destructive",
      })
    } finally {
      setSnapshotsLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!siteId) return

    setStatsLoading(true)
    try {
      const data = await SiteService.getSiteStats(siteId)
      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
      toast({
        title: "Erro",
        description: "Falha ao carregar estatísticas",
        variant: "destructive",
      })
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (open && siteId) {
      fetchLogs()
      fetchSnapshots()
      fetchStats()
    }
  }, [open, siteId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Sucesso
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Falha
      </Badge>
    )
  }

  const handleRefresh = () => {
    if (activeTab === "logs") {
      fetchLogs()
    } else if (activeTab === "snapshots") {
      fetchSnapshots()
    } else if (activeTab === "stats") {
      fetchStats()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-white border-blue-200">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-blue-900">
            Logs, Snapshots e Estatísticas - {siteName}
          </DialogTitle>
          <DialogDescription className="text-blue-700">
            Histórico de execuções, capturas de tela e estatísticas do scraper para este site
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-blue-50 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "logs" ? "bg-blue-600 text-white shadow-sm" : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                Logs ({logs.length})
              </button>
              <button
                onClick={() => setActiveTab("snapshots")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "snapshots" ? "bg-blue-600 text-white shadow-sm" : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                <Camera className="h-4 w-4 mr-1 inline" />
                Snapshots ({snapshots.length})
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "stats" ? "bg-blue-600 text-white shadow-sm" : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-1 inline" />
                Estatísticas
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || snapshotsLoading || statsLoading}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading || snapshotsLoading || statsLoading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[500px] w-full rounded-md border border-blue-200">
            {activeTab === "logs" ? (
              // Logs Tab
              loading && logs.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-blue-900">Nenhum log encontrado</h3>
                  <p className="text-blue-700">Este site ainda não foi executado ou não há logs disponíveis</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-blue-50">
                    <TableRow>
                      <TableHead className="w-16 text-blue-900 font-semibold">ID</TableHead>
                      <TableHead className="text-blue-900 font-semibold">URL</TableHead>
                      <TableHead className="w-24 text-blue-900 font-semibold">Status</TableHead>
                      <TableHead className="text-blue-900 font-semibold">Mensagem</TableHead>
                      <TableHead className="w-40 text-blue-900 font-semibold">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-blue-50/50">
                        <TableCell className="font-medium text-blue-900">{log.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-3 w-3 text-blue-500" />
                            <span className="text-sm truncate max-w-[200px] text-blue-700" title={log.url}>
                              {log.url}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(log.success)}</TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            {log.message ? (
                              <span className="text-sm text-blue-700" title={log.message}>
                                {log.message.length > 50 ? `${log.message.substring(0, 50)}...` : log.message}
                              </span>
                            ) : (
                              <span className="text-blue-500 text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-blue-700">{formatDate(log.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : activeTab === "snapshots" ? (
              // Snapshots Tab
              snapshotsLoading && snapshots.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : snapshots.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-blue-900">Nenhum snapshot encontrado</h3>
                  <p className="text-blue-700">Ainda não há capturas de tela disponíveis para este site</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className="border border-blue-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <div className="aspect-video bg-blue-50 flex items-center justify-center">
                        {snapshot.screenshot ? (
                          <img
                            src={`data:image/png;base64,${snapshot.screenshot}`}
                            alt={`Snapshot ${snapshot.id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="h-8 w-8 text-blue-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Snapshot #{snapshot.id}</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {formatDate(snapshot.taken_at)}
                          </Badge>
                        </div>
                        {snapshot.html && (
                          <p className="text-xs text-blue-600">HTML capturado ({snapshot.html.length} caracteres)</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : // Stats Tab
            statsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : stats ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total de Execuções</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.total_runs}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Execuções com Sucesso</p>
                        <p className="text-2xl font-bold text-green-900">{stats.successful_runs}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Execuções com Falha</p>
                        <p className="text-2xl font-bold text-red-900">{stats.failed_runs}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Taxa de Sucesso</p>
                        <p className="text-2xl font-bold text-purple-900">{(stats.success_rate * 100).toFixed(1)}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {stats.last_run && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Última Execução</h4>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(stats.last_run)}</p>
                  </div>
                )}

                {stats.total_runs === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-blue-900">Nenhuma estatística disponível</h3>
                    <p className="text-blue-700">Execute o scraper para gerar estatísticas</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-blue-900">Erro ao carregar estatísticas</h3>
                <p className="text-blue-700">Não foi possível carregar as estatísticas do site</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-end pt-4 border-t border-blue-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
