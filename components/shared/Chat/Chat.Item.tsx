'use client'

import { FC, useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import qs from 'query-string'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import {
  Edit, FileIcon, ShieldAlert, ShieldCheck, Trash
} from 'lucide-react'
import { Member, MemberRole } from '@prisma/client'
import { GV, IconMap } from '@/config/glob'
import { cn } from '@/lib/utils'
import { IMember } from '@/models/member'
import useModal from '@/hooks/ModalStore'
import {
  Form, FormControl, FormField, FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/shared/UserAvatar'
import ActionToolTip from '@/components/shared/ActionToolTip'
import ShortcutSpan from '../ShortcutSpan'

type TChatItemProps = {
  id: string
  currentMember: Member
  member: IMember
  content: string
  fileUrl: string | null
  timestamp: Date
  isUpdated: boolean
  deleted: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const roleIconMap: IconMap<MemberRole> = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className={'h-4 w-4 ml-1.5 text-indigo-500'} />,
  'ADMIN': <ShieldAlert className={'h-4 w-4 ml-1.5 text-indigo-500'} />,
}

const formSchema = z.object({
  content: z.string().min(1),
})


const ChatItem: FC<TChatItemProps> = ({
  id,
  currentMember,
  member,
  content,
  fileUrl,
  timestamp,
  isUpdated,
  deleted,
  socketUrl,
  socketQuery,
}) => {

  const [isEditing, setIsEditing] = useState(false)
  const params = useParams()
  const router = useRouter()

  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    }
  })

  const isLoading = form.formState.isSubmitting
  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const isAbleToDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const isAbleToEditMessage = !deleted && !fileUrl && isOwner
  const isPDF = fileUrl?.split('.').pop() === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  const handleOpenConversation = () => {
    if (member.id === currentMember.id) return

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  const handleSubmitEditing = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, data)
      form.reset()
      setIsEditing(false)
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    form.reset({
      content,
    })
  }, [ content ])

  useEffect(() => {
    const onShortcutKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        // e.preventDefault()
        setIsEditing(false)
      }
    }

    document.addEventListener('keydown', onShortcutKeyDown)
    return () => document.removeEventListener('keydown', onShortcutKeyDown)
  }, [])

  return (
    <div className={'group relative w-full p-4 flex items-center hover:bg-black/5 transition'}>
      <div className={'group w-full flex items-start gap-x-2'}>
        <div
          className={'hover:drop-shadow-md transition cursor-pointer'}
          onClick={() => handleOpenConversation()}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className={'w-full flex flex-col'}>
          <div className={'flex items-center gap-x-2'}>
            <div className={'flex items-center'}>
              <p
                className={'text-sm font-semibold hover:underline cursor-pointer'}
                onClick={() => handleOpenConversation()}
              >
                {member.profile.name}
              </p>
              <ActionToolTip label={member.role}>
                {roleIconMap[member.role]}
              </ActionToolTip>
              <span className={'ml-1.5 text-xs text-zinc-500 dark:text-zinc-400'}>
                {format(new Date(timestamp), GV.DATE_FORMAT)}
              </span>
            </div>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target={'_blank'}
              rel={'noopener noreferrer'}
              className={'relative h-48 w-48 mt-2 flex items-center border aspect-square rounded-md bg-secondary overflow-hidden'}
            >
              <Image
                src={fileUrl}
                alt={content}
                priority
                fill
                sizes={'md'}
                className={'object-cover'}
              />
            </a>
          )}
          {isPDF && (
            <div className={'relative p-2 mt-2 flex items-center rounded-md bg-background/10'}>
              <FileIcon className={'h-10 w-10 fill-indigo-200 stroke-indigo-400'} />
              <a
                href={fileUrl}
                target={'_blank'}
                rel={'noopener noreferrer'}
                className={'ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'}
              >
                {fileUrl}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p className={cn(
              'text-sm text-zinc-600 dark:text-zinc-300',
              deleted && 'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className={'mx-2 text-[.625rem] text-zinc-500 dark:text-zinc-400'}>
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className={'w-full pt-2 flex gap-x-2 items-center'}
                onSubmit={form.handleSubmit(handleSubmitEditing)}
              >
                <FormField
                  control={form.control}
                  name={'content'}
                  render={({ field }) => (
                    <FormItem className={'flex-1'}>
                      <FormControl>
                        <div className={'relative w-full'}>
                          <Input
                            placeholder={'Edited message'}
                            className={'p-2 border-none border-0 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0'}
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type={'submit'}
                  variant={'primary'}
                  size={'sm'}
                  className={''}
                  disabled={isLoading}
                  // onClick={() => {}}
                >
                  Save
                </Button>
              </form>
              <span className={'mt-1 text-[.625rem] text-zinc-400'}>
                Press <ShortcutSpan modifier={'Esc'} /> to cancel, <ShortcutSpan modifier={'Enter'} /> to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {isAbleToDeleteMessage && (
        <div className={'hidden group-hover:flex absolute -top-2 right-5 p-1 gap-x-2 items-center border rounded-sm bg-white dark:bg-zinc-800'}>
          {isAbleToEditMessage && (
            <ActionToolTip label={'Edit'}>
              <Edit
                className={'h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer'}
                onClick={() => setIsEditing(true)}
              />
            </ActionToolTip>
          )}
          <ActionToolTip label={'Delete'}>
            <Trash
              className={'h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer'}
              onClick={() => onOpen('deleteMessage', {
                apiUrl: `${socketUrl}/${id}`,
                query: socketQuery,
              })}
            />
          </ActionToolTip>
        </div>
      )}
    </div>
  )
}

export default ChatItem