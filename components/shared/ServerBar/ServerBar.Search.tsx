'use client'

import {
  FC, ReactNode, useState, useEffect
} from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Search } from 'lucide-react'
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command'
import ShortcutSpan from '@/components/shared/ShortcutSpan'

type TServerBarSearchProps = {
  data: {
    label: string
    type: 'channel' | 'member'
    data: {
      id: string
      name: string
      icon: ReactNode
    }[] | undefined
  }[]
}

const ServerBarSearch: FC<TServerBarSearchProps> = ({
  data,
}) => {

  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const handleSelect = (id: string, type: 'channel' | 'member') => {
    setOpen(false)
    if (type === 'member') return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    if (type === 'channel') return router.push(`/servers/${params?.serverId}/channels/${id}`)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        className={'group w-full px-2 py-2 flex gap-x-2 items-center rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'}
        onClick={() => setOpen(true)}
      >
        <Search className={'h-4 w-4 text-zinc-500 dark:text-zinc-400'} />
        <p
          className={'text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'}
        >
          Search
        </p>
        <ShortcutSpan
          modifier={'CTRL'}
          keycode={'K'}
        />
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder={'Search all channels and members'} />
        <CommandList>
          <CommandEmpty>
            No results found
          </CommandEmpty>
          {data.map(({ label, type, data }) => !data?.length
            ? null
            : (
              <CommandGroup
                key={label}
                heading={label}
              >
                {data.map(({ id, name, icon }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => handleSelect(id, type)}
                  >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerBarSearch