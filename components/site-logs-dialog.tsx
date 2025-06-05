"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertCircle, ExternalLink } from "lucide-react"
import { useSites } from "@/hooks/use-sites"
import { useToast } from "@/hooks/use-toast"
import type { ScrapeLogRead } from "@/types/site"

interface SiteLogsDialogProps {
  siteId: number | null
  siteName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SiteLogsDialog({ siteId, siteName, open, onOpenChange }: SiteLogsDialogProps) {
  const [logs, setLogs] = useState<ScrapeLogRead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    if (open && siteId) {
      fetchLogs()
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Logs de Scraping - {siteName}</DialogTitle>
          <DialogDescription>Histórico de execuções do scraper para este site</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {logs.length} registro{logs.length !== 1 ? "s" : ""} encontrado{logs.length !== 1 ? "s" : ""}
            </div>
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[400px] w-full rounded-md border">
            {loading && logs.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum log encontrado</h3>
                <p className="text-muted-foreground">Este site ainda não foi executado ou não há logs disponíveis</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead className="w-40">Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]" title={log.url}>
                            {log.url}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.success)}</TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          {log.message ? (
                            <span className="text-sm" title={log.message}>
                              {log.message.length > 50 ? `${log.message.substring(0, 50)}...` : log.message}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
