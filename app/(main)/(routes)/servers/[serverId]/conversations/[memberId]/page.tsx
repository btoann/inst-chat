import Conversation from '@/components/shared/Chat'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'

type TMemberIdPageProps = {
  params: {
    memberId: string
    serverId: string
  }
}

const MemberIdPage: FC<TMemberIdPageProps> = async ({
  params
}) => {

  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    }
  })

  if (!currentMember) return redirect('/')

  const conversation = await getOrCreateConversation(currentMember.id, params?.memberId)

  if (!conversation) return redirect(`/servers/${params.serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className={'h-full flex flex-col bg-white dark:bg-[#313338]'}>
      <Conversation.Header
        type={'conversation'}
        serverId={params.serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  )
}

export default MemberIdPage