import { FC } from 'react'
import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'
import { getOrCreateConversation } from '@/lib/conversation'
import Chat from '@/components/shared/Chat'
import MediaRoom from '@/components/shared/MediaRoom'

type TMemberIdPageProps = {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MemberIdPage: FC<TMemberIdPageProps> = async ({
  params, searchParams
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
      <Chat.Header
        type={'conversation'}
        serverId={params.serverId}
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
      />
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!searchParams.video && (
        <>
          <Chat.Messages
            type={'conversation'}
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            apiUrl={'/api/direct-messages'}
            paramKey={'conversationId'}
            paramValue={conversation.id}
            socketUrl={'/api/socket/direct-messages'}
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <Chat.Input
            type={'conversation'}
            name={otherMember.profile.name}
            apiUrl={'/api/socket/direct-messages'}
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MemberIdPage