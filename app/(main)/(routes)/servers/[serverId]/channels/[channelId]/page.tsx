import { FC } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import Conversation from '@/components/shared/Conversation'

type TChannlIdPageProps = {
  params: {
    serverId: string
    channelId: string
  }
}

const ChannelIdPage: FC<TChannlIdPageProps> = async ({
  params
}) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    }
  })

  const memeber = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    }
  })

  if (!channel || !memeber) redirect('/')

  return (
    <div className={'h-full flex flex-col bg-white dark:bg-[#313338]'}>
      <Conversation.Header
        name={channel.name}
        serverId={channel.serverId}
        type={'channel'}
      />
    </div>
  )
}

export default ChannelIdPage