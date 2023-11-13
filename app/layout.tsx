import { FC, ReactNode } from 'react'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clonecord Chat Application',
  description: 'Generated by create next app',
}

interface IRootLayoutProps {
  children: ReactNode
}

const RootLayout: FC<IRootLayoutProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang={'en'}>
        <body className={font.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout