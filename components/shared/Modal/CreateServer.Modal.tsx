'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useModal from '@/hooks/ModalStore'
import {
  Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogFooter
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Uploader from '@/components/shared/Uploader'

const formSchema = z.object({
  name: z.string().min(1, 'Server name is required.'),
  imageUrl: z.string().min(1, 'Server image is required.'),
})

const CreateServerModal = ({}) => {

  const { type, isOpen, onClose } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'createServer'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', data)
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

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => handleClose()}
    >
      <DialogContent className={'bg-white text-black p-0 overflow-hidden'}>
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className={'text-2xl text-center font-bold'}>
            Customize your server
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500'}>
            Give your server a personality with a name and an image.
            <br />
            You can always change it later.
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
                  name={'imageUrl'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Uploader
                          endpoint={'serverImage'}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={'name'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={'uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'}>
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={'bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'}
                        placeholder={'Enter server name'}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateServerModal