'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useModal from '@/hooks/ModalStore'
import {
  Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogFooter
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Uploader from '@/components/shared/Uploader'

const formSchema = z.object({
  fileUrl: z.string().min(1, 'Attachment is required.'),
})

const MessageFileModal = ({}) => {

  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'messageFile'
  const { apiUrl, query } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleClose = () => {
    form.reset()
    onClose()
  }
  
  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query: (query as any),
      })
      await axios.post(url, {
        ...data,
        content: data.fileUrl,
      })
      form.reset()
      router.refresh()
      handleClose()
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => handleClose()}
    >
      <DialogContent className={'bg-white text-black p-0 overflow-hidden'}>
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className={'text-2xl text-center font-bold'}>
            Add an attachment
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500'}>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className={'space-y-8'}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className={'space-y-8 px-6'}>
              <div className={'flex items-center justify-center text-center'}>
                <FormField
                  control={form.control}
                  name={'fileUrl'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Uploader
                          endpoint={'messageFile'}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className={'bg-gray-100 px-6 py-4'}>
              <Button
                variant={'primary'}
                disabled={isLoading}
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal