import { FC } from 'react'
import { redirect } from 'next/navigation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'
import ServerBarHeader from './ServerBar.Header'

type TServerBarProps = {
  serverId: string
}

const ServerBar: FC<TServerBarProps> = async ({ serverId }) => {

  const profile = await currentProfile()

  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        }
      }
    }
  })

  if (!server) return redirect('/')

  const textChannels = server?.channels.filter(ch => ch.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(ch => ch.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(ch => ch.type === ChannelType.VIDEO)
  const members = server?.members.filter(mem => mem.profileId !== profile.id)

  const role = server.members.find(mem => mem.profileId === profile.id)?.role

  return (
    <div className={'flex flex-col h-full text-primary w-full bg-[#f2f3f5] dark:bg-[#2b2d31]'}>
      <ServerBarHeader
        server={server}
        role={role}
      />
    </div>
  )
}

export default ServerBar