export interface UserProfile {
  id: number
  email: string
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  profile_image?: string | null
  organization?: string | null
  contact?: string | null
  company?: string | null
  job_title?: string | null
  is_subscribed: boolean
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSettingsUpdate {
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  organization?: string | null
  contact?: string | null
  company?: string | null
  job_title?: string | null
  is_subscribed?: boolean
}

export interface PasswordChangeRequest {
  old_password: string
  new_password: string
}

export interface NotificationSettings {
  isSubscribed: boolean
  emailAlerts: boolean
  smsAlerts: boolean
  weeklyReport: boolean
}

export interface ProfileSettings {
  username: string
  firstName: string
  lastName: string
  email: string
  profileImage: string
  organization: string
  contact: string
  company: string
  jobTitle: string
  preferredLanguage: string
}
