'use client'

import qs from 'query-string'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Video, VideoOff } from 'lucide-react'
import ActionToolTip from '@/components/shared/ActionToolTip'

const ChatVideoTrigger = () => {

  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isVideo = searchParams?.get('video')

  const Icon = isVideo ? VideoOff : Video
  const label = isVideo ? 'End video call' : 'Start video call'

  const handleClick = () => {
    const url = qs.stringifyUrl({
      url: pathName || '',
      query: {
        video: isVideo ? undefined : true,
      },
    }, { skipNull: true })

    router.push(url)
  }

  return (
    <ActionToolTip
      side={'bottom'}
      label={label}
    >
      <button
        className={'mr-4 hover:opacity-75 transition'}
        onClick={() => handleClick()}
      >
        <Icon className={'h-6 w-6 text-zinc-500 dark:text-zinc-400'} />
      </button>
    </ActionToolTip>
  )
}

export default ChatVideoTrigger