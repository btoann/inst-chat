import { FC } from 'react'
import { Hash } from 'lucide-react'
import MobileToggle from '@/components/shared/MobileToggle'
import UserAvatar from '@/components/shared/UserAvatar'
import SocketIndicator from '@/components/shared/SocketIndicator'
import ChatVideoTrigger from './Chat.VideoTrigger'

type TChatHeaderProps = {
  type: 'channel' | 'conversation'
  serverId: string
  name: string
  imageUrl?: string
}

const ChatHeader: FC<TChatHeaderProps> = ({
  type, serverId, name, imageUrl
}) => {
  return (
    <div className={'h-12 px-3 flex items-center text-md font-semibold border-b-2 border-neutral-200 dark:border-neutral-800'}>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className={'h-5 w-5 mr-2 text-zinc-500 dark:text-zinc-400'} />
      )}
      {type === 'conversation' && (
        <UserAvatar
          src={imageUrl}
          className={'h-8 w-8 md:h-8 md:w-8 mr-2'}
        />
      )}
      <p className={'text-md font-semibold text-black dark:text-white'}>
        {name}
      </p>
      <div className={'ml-auto flex items-center'}>
        {type === 'conversation' && (
          <ChatVideoTrigger />
        )}
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader