import { FC, ReactNode } from 'react'

interface IAuthLayoutProps {
  children: ReactNode
}

const AuthLayout: FC<IAuthLayoutProps> = ({ children }) => {
  return (
    <div className={'h-full flex items-center justify-center'}>
      {children}
    </div>
  )
}

export default AuthLayout