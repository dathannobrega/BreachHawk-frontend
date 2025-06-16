import UserAvatar from "@/components/user-avatar"

interface UserHeaderProps {
  name: string
  email: string
  imageUrl: string
}

export function UserHeader({ name, email, imageUrl }: UserHeaderProps) {
  // Função para gerar iniciais do usuário a partir do nome
  const getUserInitials = () => {
    if (!name) return "U"
    const nameParts = name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return name[0].toUpperCase()
  }

  return (
    <div className="flex items-center space-x-4">
      <UserAvatar
        profileImage={imageUrl}
        userName={name}
        userInitials={getUserInitials()}
        size="md"
      />
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  )
}
