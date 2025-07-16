"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showFallback?: boolean
}

// Cache simples para imagens de perfil
const imageCache = new Map<string, string>()
const failedImages = new Set<string>()

export function UserAvatar({ className, size = "md", showFallback = true }: UserAvatarProps) {
  const { user } = useAuth()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const getUserDisplayName = () => {
    if (!user) return "Usuário"
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    if (user.first_name) return user.first_name
    if (user.username) return user.username
    return "Usuário"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.first_name && user.last_name) return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    if (user.first_name) return user.first_name[0].toUpperCase()
    if (user.username) return user.username[0].toUpperCase()
    return "U"
  }

  useEffect(() => {
    if (!user?.profile_image) {
      setImageSrc(null)
      return
    }

    const imageUrl = `${apiUrl}${user.profile_image}`

    // Verifica se a imagem já falhou antes
    if (failedImages.has(imageUrl)) {
      setImageError(true)
      return
    }

    // Verifica se a imagem está no cache
    if (imageCache.has(imageUrl)) {
      setImageSrc(imageCache.get(imageUrl)!)
      setImageError(false)
      return
    }

    // Pré-carrega a imagem para verificar se existe
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Cria um blob URL para cache local
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob)
          imageCache.set(imageUrl, blobUrl)
          setImageSrc(blobUrl)
          setImageError(false)
        })
        .catch(() => {
          failedImages.add(imageUrl)
          setImageError(true)
        })
    }

    img.onerror = () => {
      failedImages.add(imageUrl)
      setImageError(true)
    }

    img.src = imageUrl
  }, [user?.profile_image, apiUrl])

  // Cleanup blob URLs quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [imageSrc])

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageSrc && !imageError ? (
        <AvatarImage
          src={imageSrc || "/placeholder.svg"}
          alt={getUserDisplayName()}
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : showFallback ? (
        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">{getUserInitials()}</AvatarFallback>
      ) : null}
    </Avatar>
  )
}

// Hook para limpar o cache quando necessário
export function useAvatarCache() {
  const clearCache = () => {
    // Revoga todos os blob URLs
    imageCache.forEach((blobUrl) => {
      if (blobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(blobUrl)
      }
    })
    imageCache.clear()
    failedImages.clear()
  }

  const clearFailedImages = () => {
    failedImages.clear()
  }

  return { clearCache, clearFailedImages }
}
