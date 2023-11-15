import { FC, ReactNode } from 'react'
import Navigation from '@/components/shared/Navigation'

interface IMainLayoutProps {
  children: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
  return (
    <div className={'h-full'}>
      <div className={'hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'}>
        <Navigation />
      </div>
      <main className={'md:pl-[72px] h-full'}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout