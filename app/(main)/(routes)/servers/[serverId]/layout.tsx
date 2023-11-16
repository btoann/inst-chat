import { FC, ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import ServerBar from '@/components/shared/ServerBar'

type TServerIdLayoutProps = {
  params: {
    serverId: string
  }
  children: ReactNode
}

const ServerIdLayout: FC<TServerIdLayoutProps> = async ({ children, params }) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      },
    }
  })

  if (!server) return redirect('/')

  return (
    <div className={'h-full'}>
      <div className={'hidden md:flex flex-col h-full w-60 fixed inset-y-0 z-20'}>
        <ServerBar serverId={params.serverId} />
      </div>

      <main className={'h-full md:pl-60'}>
        {children}
      </main>
    </div>
  )
}

export default ServerIdLayout