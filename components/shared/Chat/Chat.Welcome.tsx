import { FC } from 'react'
import { Hash } from 'lucide-react'

type TChatWelcomeProps = {
  type: 'channel' | 'conversation'
  name: string
}

const ChatWelcome: FC<TChatWelcomeProps> = ({
  type, name
}) => {
  return (
    <div className={'px-4 mb-4 space-y-2'}>
      {type === 'channel' && (
        <div className={'h-20 w-20 flex items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700'}>
          <Hash className={'h-12 w-12 text-white'} />
        </div>
      )}
      <p className={'text-xl md:text-3xl font-bold'}>
        {type === 'channel' ? 'Welcome to #' : ''}{name}
      </p>
      <p className={'text-sm text-zinc-600 dark:text-zinc-400'}>
        {
          type === 'channel'
            ? `This is the start of the #${name} channel.`
            : `Start your conversation with #${name}`
        }
      </p>
    </div>
  )
}

export default ChatWelcome