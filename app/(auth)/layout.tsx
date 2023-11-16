import { FC, ReactNode } from 'react'

type TAuthLayoutProps = {
  children: ReactNode
}

const AuthLayout: FC<TAuthLayoutProps> = ({ children }) => {
  return (
    <div className={'h-full flex items-center justify-center'}>
      {children}
    </div>
  )
}

export default AuthLayout