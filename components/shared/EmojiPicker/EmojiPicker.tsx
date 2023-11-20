'use client'

import { FC } from 'react'
import { useTheme } from 'next-themes'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Smile } from 'lucide-react'
import {
  Popover, PopoverTrigger, PopoverContent
} from '@/components/ui/popover'

type TEmojiPickerProps = {
  onChange: (value: string) => void
}

const EmojiPicker: FC<TEmojiPickerProps> = ({
  onChange,
}) => {

  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className={'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'} />
      </PopoverTrigger>
      <PopoverContent
        side={'right'}
        sideOffset={40}
        className={'mb-16 border-none bg-transparent shadow-none drop-shadow-none'}
      >
        <Picker
          data={data}
          theme={resolvedTheme}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker