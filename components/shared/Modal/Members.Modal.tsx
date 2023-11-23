'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import axios from 'axios'
import {
  Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion, UserMinus
} from 'lucide-react'
import { MemberRole } from '@prisma/client'
import { IconMap } from '@/config/glob'
import useModal from '@/hooks/ModalStore'
import { IServer } from '@/models/server'
import {
  Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/shared/UserAvatar'

const roleIcons: IconMap<MemberRole> = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className={'h-4 w-4 ml-2 text-indigo-500'} />,
  'ADMIN': <ShieldAlert className={'h-4 w-4 ml-2 text-rose-500'} />,
}


const MembersModal = ({}) => {

  const [loadingId, setLoadingId] = useState('')
  const router = useRouter()

  const { data, type, isOpen, onOpen, onClose } = useModal()

  const isModalOpen = isOpen && type === 'members'
  const { server } = data as { server: IServer }

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })
      const response = await axios.patch(url, { role })
      router.refresh()
      onOpen('members', { server: response.data })
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoadingId('')
    }
  }

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      })
      const response = await axios.delete(url)
      router.refresh()
      onOpen('members', { server: response.data })
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => onClose()}
    >
      <DialogContent className={'bg-white text-black overflow-hidden'}>
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className={'text-2xl text-center font-bold'}>
            Manage Members
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500'}>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={'max-h-[26.25rem] pr-6 mt-8'}>
          {server?.members?.map(member => (
            <div
              key={member.id}
              className={'flex items-center gap-x-2 mb-6'}
            >
              <UserAvatar src={member.profile.imageUrl} />
              <div className={'flex flex-col gap-y-1'}>
                <div className={'flex items-center gap-x-1 text-xs font-semibold'}>
                  {member.profile.name}
                  {roleIcons[member.role]}
                </div>
                <p className={'text-xs text-zinc-500'}>
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className={'ml-auto'}>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className={'h-4 w-4 text-zinc-500'} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={'left'}>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={'flex items-center'}>
                          <ShieldQuestion className={'h-4 w-4 mr-2'} />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, 'GUEST')}
                            >
                              <Shield className={'h-4 w-4 mr-2'} />
                              <span>Guest</span>
                              {member.role === 'GUEST' && (
                                <Check className={'h-4 w-4 ml-auto'} />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member.id, 'MODERATOR')}
                            >
                              <ShieldCheck className={'h-4 w-4 mr-2'} />
                              <span>Moderator</span>
                              {member.role === 'MODERATOR' && (
                                <Check className={'h-4 w-4 ml-auto'} />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleKick(member.id)}
                      >
                        {/* <Gavel className={'h-4 w-4 mr-2'} /> */}
                        <UserMinus className={'h-4 w-4 mr-2'} />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className={'h-4 w-4 ml-auto text-zinc-500 animate-spin'} />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MembersModal