'use client'

import { FC } from 'react'
import {
  Plus, Settings
} from 'lucide-react'
import { MemberRole, ChannelType } from '@prisma/client'
import { IServer } from '@/models/server'
import useModal from '@/hooks/ModalStore'
import ActionToolTip from '@/components/shared/ActionToolTip'

type TServerBarSectionProps = {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: IServer
}

const ServerBarSection: FC<TServerBarSectionProps> = ({
  label, role, sectionType, channelType, server
}) => {

  const { onOpen } = useModal()

  return (
    <div className={'py-2 flex items-center justify-between'}>
      <p className={'text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'}>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionToolTip
          side={'top'}
          label={'Create Channel'}
        >
          <button
            className={'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'}
            onClick={() => onOpen('createChannel', { channelType })}
          >
            <Plus className={'h-4 w-4'} />
          </button>
        </ActionToolTip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionToolTip
          side={'top'}
          label={'Manage Members'}
        >
          <button
            className={'text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'}
            onClick={() => onOpen('members', { server })}
          >
            <Settings className={'h-4 w-4'} />
          </button>
        </ActionToolTip>
      )}
    </div>
  )
}

export default ServerBarSection