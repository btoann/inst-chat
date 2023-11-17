'use client'

import { FC } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { MemberRole } from '@prisma/client'
import { cn } from '@/lib/utils'
import { IServer } from '@/models/server'
import { IMember } from '@/models/member'
import UserAvatar from '@/components/shared/UserAvatar'

type TServerBarMemberProps = {
  member: IMember
  server: IServer
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className={'h-4 w-4 ml-2 text-indigo-500'} />,
  [MemberRole.ADMIN]: <ShieldAlert className={'h-4 w-4 ml-2 text-rose-500'} />,
}


const ServerBarMember: FC<TServerBarMemberProps> = ({
  member, server
}) => {

  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  const handleMakeConversation = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <button
      className={cn(
        'group w-full px-2 py-2 mb-1 flex items-center gap-x-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      onClick={() => handleMakeConversation()}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className={'h-8 w-8 md:h-8 md:w-8'}
      />
      <p className={cn(
        'text-sm line-clamp-1 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
        params?.memberId === member.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
      )}>
        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}

export default ServerBarMember