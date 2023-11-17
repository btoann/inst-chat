'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import qs from 'query-string'
import { ChannelType } from '@prisma/client'
import { GV } from '@/config/glob'
import useModal from '@/hooks/ModalStore'
import {
  Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  name: z.string()
    .min(1, 'Channel name is required.')
    .refine(name => name !== GV.DEFAULT_CHANNEL, `Channel name cannot be '${GV.DEFAULT_CHANNEL}'`),
  type: z.nativeEnum(ChannelType),
})

const EditChannelModal = ({}) => {

  const { type, isOpen, onClose, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'editChannel'
  const { server, channel } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: channel?.type || ChannelType.TEXT,
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })
      await axios.patch(url, data)
      form.reset()
      router.refresh()
      onClose()
    }
    catch (err) {
      console.error(err)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
  }, [ form, channel ])

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => handleClose()}
    >
      <DialogContent className={'bg-white text-black p-0 overflow-hidden'}>
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className={'text-2xl text-center font-bold'}>
            Edit Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className={'space-y-8'}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className={'space-y-8 px-6'}>
              <FormField
                control={form.control}
                name={'name'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'}>
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={'bg-zinc-300/50 text-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0'}
                        placeholder={'Enter channel name'}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'type'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'}>
                      Channel type
                    </FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className={'bg-zinc-300/50 text-black capitalize border-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 outline-none'}>
                          <SelectValue placeholder={'Select a channel type'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map(type => (
                          <SelectItem
                            key={type}
                            value={type}
                            className={'capitalize'}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className={'bg-gray-100 px-6 py-4'}>
              <Button
                variant={'primary'}
                disabled={isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal