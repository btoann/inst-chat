'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import useModal from '@/hooks/ModalStore'
import {
  Form, FormControl, FormField, FormItem
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import EmojiPicker from '@/components/shared/EmojiPicker'

type TChatInputProps = {
  type: 'conversation' | 'channel'
  name: string
  apiUrl: string
  query: Record<string, unknown>
}

const formSchema = z.object({
  content: z.string().min(1),
})

const ChatInput: FC<TChatInputProps> = ({
  type, name, apiUrl, query
}) => {

  const router = useRouter()
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: (query as any),
      })

      await axios.post(url, data)
      form.reset()
      router.refresh()
    }
    catch (err) {
      console.error(err)  
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={'relative p-4 pb-6'}>
                  <button
                    type={'button'}
                    className={'absolute top-7 left-8 h-6 w-6 p-1 flex items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition'}
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                  >
                    <Plus className={'text-white dark:text-[#313338]'} />
                  </button>
                  <Input
                    placeholder={`Message ${type === 'channel' ? '#' : ''}${name}`}
                    className={'px-14 py-6 border-none border-0 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0'}
                    disabled={isLoading}
                    {...field}
                  />
                  <div className={'absolute top-7 right-8'}>
                    <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput