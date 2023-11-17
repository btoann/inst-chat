import { FC } from 'react'
import { Hash } from 'lucide-react'
import MobileToggle from '@/components/shared/MobileToggle'

type TConversationHeaderProps = {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

const ConversationHeader: FC<TConversationHeaderProps> = ({
  serverId, name, type, imageUrl
}) => {
  return (
    <div className={'h-12 px-3 flex items-center text-md font-semibold border-b-2 border-neutral-200 dark:border-neutral-800'}>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className={'h-5 w-5 mr-2 text-zinc-500 dark:text-zinc-400'} />
      )}
      <p className={'text-md font-semibold text-black dark:text-white'}>
        {name}
      </p>
    </div>
  )
}

export default ConversationHeader