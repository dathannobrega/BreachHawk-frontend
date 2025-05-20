import "../styles/auth-layout.css"

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-dark to-primary z-[-1]"></div>
      <div className="w-full max-w-md p-5 z-[1]">{children}</div>
    </div>
  )
}

export default AuthLayout
