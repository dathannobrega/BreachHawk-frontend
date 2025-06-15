"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Upload, Loader2, Trash2, Settings, AlertCircle, CheckCircle, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import CardTemplate from "@/components/templates/card-template"

interface ScraperManagementProps {
  availableScrapers: string[]
  scrapersLoading: boolean
  onUploadScraper: (file: File) => Promise<{ msg: string; slug: string }>
  onDeleteScraper: (slug: string) => Promise<void>
  onRefresh: () => Promise<void>
}

export function ScraperManagement({
  availableScrapers,
  scrapersLoading,
  onUploadScraper,
  onDeleteScraper,
  onRefresh,
}: ScraperManagementProps) {
  const { toast } = useToast()
  const [scraperFile, setScraperFile] = useState<File | null>(null)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [scraperToDelete, setScraperToDelete] = useState<string | null>(null)
  const [isDeletingScraper, setIsDeletingScraper] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  const handleScraperUpload = async () => {
    if (!scraperFile) {
      toast({
        title: "Erro de Validação",
        description: "Selecione um arquivo Python (.py)",
        variant: "destructive",
      })
      return
    }

    // Validar extensão do arquivo
    if (!scraperFile.name.endsWith(".py")) {
      toast({
        title: "Erro de Validação",
        description: "Apenas arquivos .py são aceitos",
        variant: "destructive",
      })
      return
    }

    setIsUploadingFile(true)
    setUploadSuccess(null)

    try {
      const result = await onUploadScraper(scraperFile)

      toast({
        title: "Upload Realizado com Sucesso!",
        description: `${result.msg} - Slug: ${result.slug}`,
      })

      setUploadSuccess(`Scraper "${result.slug}" foi adicionado com sucesso!`)
      setScraperFile(null)

      // Reset file input
      const fileInput = document.getElementById("scraper-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Auto-hide success message after 5 seconds
      setTimeout(() => setUploadSuccess(null), 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao fazer upload do scraper"
      toast({
        title: "Erro no Upload",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploadingFile(false)
    }
  }

  const handleDeleteScraper = (slug: string) => {
    setScraperToDelete(slug)
    setShowDeleteDialog(true)
  }

  const confirmDeleteScraper = async () => {
    if (!scraperToDelete) return

    setIsDeletingScraper(true)
    try {
      await onDeleteScraper(scraperToDelete)

      toast({
        title: "Scraper Excluído",
        description: `Scraper "${scraperToDelete}" foi removido com sucesso!`,
      })

      setShowDeleteDialog(false)
      setScraperToDelete(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir scraper"
      toast({
        title: "Erro na Exclusão",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeletingScraper(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setScraperFile(file)
    setUploadSuccess(null) // Clear success message when new file is selected
  }

  return (
    <>
      <CardTemplate
        title="Gerenciamento de Scrapers"
        description="Faça upload, visualize e gerencie scrapers personalizados do sistema"
        variant="blue"
        headerActions={<Settings className="h-5 w-5 text-blue-600" />}
      >
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Upload de Novo Scraper</h4>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  id="scraper-file"
                  type="file"
                  accept=".py"
                  onChange={handleFileChange}
                  className="flex-1 border-blue-200 focus:border-blue-400"
                  disabled={isUploadingFile}
                />
                <Button
                  onClick={handleScraperUpload}
                  disabled={!scraperFile || isUploadingFile}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-blue-600 space-y-1">
                <p>• Apenas arquivos .py são aceitos</p>
                <p>• O scraper deve implementar a interface correta e registrar-se no registry</p>
                <p>• Tamanho máximo: 10MB</p>
              </div>
            </div>

            {/* Success Message */}
            {uploadSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{uploadSuccess}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Scrapers List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-blue-900">Scrapers Disponíveis</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={scrapersLoading}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                {scrapersLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar"}
              </Button>
            </div>

            {scrapersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-3 text-blue-600" />
                <span className="text-blue-600">Carregando scrapers...</span>
              </div>
            ) : availableScrapers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableScrapers.map((scraper) => (
                  <div
                    key={scraper}
                    className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-white hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <Badge variant="outline" className="border-blue-200 text-blue-700 font-medium">
                        {scraper}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteScraper(scraper)}
                      title={`Excluir scraper ${scraper}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileCode className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                <p className="text-blue-600 font-medium">Nenhum scraper disponível</p>
                <p className="text-blue-500 text-sm mt-1">Faça upload do seu primeiro scraper personalizado</p>
              </div>
            )}
          </div>
        </div>
      </CardTemplate>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Confirmar Exclusão do Scraper
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-700">
              Tem certeza que deseja excluir o scraper <strong>"{scraperToDelete}"</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita e todos os sites que usam este scraper podem ser afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteScraper}
              disabled={isDeletingScraper}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeletingScraper ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Scraper
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
