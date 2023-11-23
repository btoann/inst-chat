'use client'

import { FC, ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import ActionToolTip from '@/components/shared/ActionToolTip'

type TSideBarItemProps = {
  id: string
  name: string
  imageUrl: string
}

const SideBarItem: FC<TSideBarItemProps> = ({ id, name, imageUrl }) => {

  const params = useParams()
  const router = useRouter()

  const handleClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionToolTip
      side={'right'}
      align={'center'}
      label={name}
    >
      <button
        className={'group relative flex items-center'}
        onClick={() => handleClick()}
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2',
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-2xl',
          )}
        >
          <Image
            src={imageUrl}
            alt={name}
            priority
            fill
            sizes={'sm'}
            className={'object-cover'}
          />
        </div>
      </button>
    </ActionToolTip>
  )
}

export default SideBarItem