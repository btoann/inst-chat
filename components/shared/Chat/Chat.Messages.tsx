'use client'

import { FC, Fragment, useRef, ElementRef } from 'react'
import { Loader2, ServerCrash } from 'lucide-react'
import { Member } from '@prisma/client'
import { ChatMessagesType } from '@/config/glob'
import { SOCKET_CHAT_KEYS } from '@/config/socketKeys'
import { IMessage } from '@/models/message'
import { useChatSocket } from '@/hooks/ChatSocket'
import { useChatScroll } from '@/hooks/ChatScroll'
import { useChatQuery } from '@/hooks/ChatQuery'
import ChatWelcome from './Chat.Welcome'
import ChatItem from './Chat.Item'

type TChatMessagesProps = {
  type: ChatMessagesType
  name: string
  member: Member
  chatId: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  socketUrl: string
  socketQuery: Record<string, string>
}

const ChatMessages: FC<TChatMessagesProps> = ({
  type,
  name,
  member,
  chatId,
  apiUrl,
  paramKey,
  paramValue,
  socketUrl,
  socketQuery,
}) => {

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    chatId,
    apiUrl,
    paramKey,
    paramValue,
  })

  const addKey = SOCKET_CHAT_KEYS.ADD(type, chatId)
  const updateKey = SOCKET_CHAT_KEYS.UPDATE(type, chatId)

  useChatSocket({ chatId, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
  })

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
    <div
      ref={chatRef}
      className={'py-4 flex flex-1 flex-col overflow-y-auto'}
    >
      {!hasNextPage && (
        <>
          <div className={'flex-1'} />
          <ChatWelcome
            type={type}
            name={name}
          />
        </>
      )}
      {hasNextPage && (
        <div className={'flex justify-center'}>
          {
            isFetchingNextPage
              ? <Loader2 className={'h-6 w-6 my-4 text-zinc-500 animate-spin'} />
              : (
                <button
                  className={'my-4 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'}
                  onClick={() => fetchNextPage()}
                >
                  Load previous messages
                </button>
              )
          }
        </div>
      )}
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
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessages