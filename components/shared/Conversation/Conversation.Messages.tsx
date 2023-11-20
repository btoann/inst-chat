'use client'

import { Member } from '@prisma/client'
import { FC } from 'react'
import ConversationWelcome from './Conversation.Welcome'
import { useChatQuery } from '@/hooks/ChatQuery'

type TConversationMessagesProps = {
  type: 'channel' | 'conversation'
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

const ConversationMessages: FC<TConversationMessagesProps> = ({
  type,
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
}) => {

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  return (
    <div className={'py-4 flex flex-1 flex-col overflow-y-auto'}>
      <div className={'flex-1'} />
      <ConversationWelcome
        type={type}
        name={name}
      />
    </div>
  )
}

export default ConversationMessages