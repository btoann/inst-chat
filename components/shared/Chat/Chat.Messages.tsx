'use client'

import { FC, Fragment } from 'react'
import { Loader2, ServerCrash } from 'lucide-react'
import { Member } from '@prisma/client'
import { IMessage } from '@/models/message'
import { useChatQuery } from '@/hooks/ChatQuery'
import ChatWelcome from './Chat.Welcome'
import ChatItem from './Chat.Item'
import { GV } from '@/config/glob'
import { useChatSocket } from '@/hooks/ChatSocket'

type TChatMessagesProps = {
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

const ChatMessages: FC<TChatMessagesProps> = ({
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
    chatId,
    apiUrl,
    paramKey,
    paramValue,
  })

  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  useChatSocket({ chatId, addKey, updateKey })

  if (status === 'pending') return (
    <div className={'flex flex-1 flex-col justify-center items-center'}>
      <Loader2 className={'h-7 w-7 my-4 text-zinc-500 animate-spin'} />
      <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
        Loading message...
      </p>
    </div>
  )
  
  if (status === 'error') return (
    <div className={'flex flex-1 flex-col justify-center items-center'}>
      <ServerCrash className={'h-7 w-7 my-4 text-zinc-500'} />
      <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
        Something went wrong!
      </p>
    </div>
  )

  return (
    <div className={'py-4 flex flex-1 flex-col overflow-y-auto'}>
      <div className={'flex-1'} />
      <ChatWelcome
        type={type}
        name={name}
      />
      <div className={'mt-auto flex flex-col-reverse'}>
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: IMessage) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                // timestamp={format(new Date(message.createdAt), GV.DATE_FORMAT)}
                timestamp={message.createdAt}
                isUpdated={message.updatedAt !== message.createdAt}
                deleted={message.deleted}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ChatMessages