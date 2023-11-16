'use client'

import { FC } from 'react'
import { IServer } from '@/models/server'
import { MemberRole } from '@prisma/client'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users
} from 'lucide-react'
import useModal from '@/hooks/ModalStore'

type TServerBarHeaderProps = {
  server: IServer
  role?: MemberRole
}

const ServerBarHeader: FC<TServerBarHeaderProps> = ({
  server, role
}) => {

  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={'focus:outline-none'}
      >
        <button
          className={'flex items-center h-12 w-full px-3 text-md font-semibold border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'}
        >
          {server.name}
          <ChevronDown className={'h-5 w-5 ml-auto'} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400'}>
        {isModerator && (
          <DropdownMenuItem
            className={'px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer'}
            onClick={() => onOpen('invite', { server })}
          >
            Invite People
            <UserPlus className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className={'px-3 py-2 text-sm cursor-pointer'}
            onClick={() => onOpen('editServer', { server })}
          >
            Server Settings
            <Settings className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className={'px-3 py-2 text-sm cursor-pointer'}
            onClick={() => onOpen('members', { server })}
          >
            Manage Members
            <Users className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className={'px-3 py-2 text-sm cursor-pointer'}>
            Create Channel
            <PlusCircle className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuSeparator />
        )}
        {isAdmin && (
          <DropdownMenuItem className={'px-3 py-2 text-sm text-rose-500 cursor-pointer'}>
            Delete Server
            <Trash className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className={'px-3 py-2 text-sm text-rose-500 cursor-pointer'}>
            Leave Server
            <LogOut className={'h-4 w-4 ml-auto'} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerBarHeader