"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ src, alt = "User avatar", fallback = "U", size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  // Handle API URLs
  const imageUrl = src ? (src.startsWith("http") ? src : `${process.env.NEXT_PUBLIC_API_BASE_URL}${src}`) : undefined

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={imageUrl || "/placeholder.svg"} alt={alt} className="object-cover" />
      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
        {fallback.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
