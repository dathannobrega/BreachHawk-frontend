"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  profileImage?: string | null
  userName: string
  userInitials: string
  className?: string
  size?: "sm" | "md" | "lg"
}

// Armazena as imagens já carregadas em cache no cliente
const imageCache: Record<string, string> = {}

// Componente isolado e memorizado para o avatar do usuário
const UserAvatar = React.memo(function UserAvatar({
  profileImage,
  userName,
  userInitials,
  className = "",
  size = "md"
}: UserAvatarProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Tamanhos pré-definidos
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  // Memorizar a URL da imagem de perfil
  const imageUrl = useMemo(() => {
    if (!profileImage || profileImage.trim() === '') {
      return null
    }

    return profileImage.startsWith('http')
      ? profileImage
      : `${apiUrl}${profileImage}`
  }, [profileImage, apiUrl])

  // Carregar a imagem apenas uma vez e armazenar em cache
  useEffect(() => {
    if (!imageUrl || imageError) return

    // Se já temos esta imagem em cache, use-a imediatamente
    if (imageCache[imageUrl]) {
      setImageData(imageCache[imageUrl])
      return
    }

    // Flag para evitar problemas de memory leak se o componente desmontar
    let isMounted = true

    // Função para carregar e converter a imagem para base64
    const loadImage = async () => {
      try {
        const response = await fetch(imageUrl, {
          // Evitar que o navegador use cache
          cache: 'no-store',
          headers: {
            // Definir cabeçalho de cache para evitar que o navegador armazene a imagem
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) throw new Error('Failed to load image')

        const blob = await response.blob()
        const reader = new FileReader()

        reader.onload = () => {
          if (!isMounted) return

          // Armazenar no cache para uso futuro
          const base64data = reader.result as string
          imageCache[imageUrl] = base64data
          setImageData(base64data)
        }

        reader.readAsDataURL(blob)
      } catch (err) {
        if (isMounted) {
          console.error('Error loading avatar image:', err)
          setImageError(true)
        }
      }
    }

    loadImage()

    // Cleanup
    return () => {
      isMounted = false
    }
  }, [imageUrl, imageError])

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {!imageError && imageData ? (
        <AvatarImage
          src={imageData}
          alt={userName}
          className="object-cover"
        />
      ) : (
        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
          {userInitials}
        </AvatarFallback>
      )}
    </Avatar>
  )
})

export default UserAvatar
