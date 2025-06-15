import { UserAvatar } from "@/components/user-avatar"

interface UserHeaderProps {
  name: string
  email: string
  imageUrl: string
}

export function UserHeader({ name, email, imageUrl }: UserHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar src={imageUrl} alt={name} />
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
    </div>
  )
}
