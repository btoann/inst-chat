import { FC } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { GV } from '@/config/glob'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

type TServerIdPageProps = {
  params: {
    serverId: string
  }
}

const ServerIdPage: FC<TServerIdPageProps> = async ({
  params
}) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: GV.DEFAULT_CHANNEL,
        },
        orderBy: {
          createdAt: 'asc',
        }
      }
    }
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== GV.DEFAULT_CHANNEL) return null

  return redirect(`/servers/${params?.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage