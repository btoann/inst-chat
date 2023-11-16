'use client'

import { useState } from 'react'
import axios from 'axios'
import useModal from '@/hooks/ModalStore'
import useOrigin from '@/hooks/Origin'
import {
  Dialog, DialogTitle, DialogContent, DialogHeader
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'

const InviteModal = ({}) => {

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { data, type, isOpen, onOpen, onClose } = useModal()
  const origin = useOrigin()

  const isModalOpen = isOpen && type === 'invite'
  const { server } = data

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleGenerateNewLink = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpen('invite', { server: response.data })
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => onClose()}
    >
      <DialogContent className={'bg-white text-black p-0 overflow-hidden'}>
        <DialogHeader className={'pt-8 px-6'}>
          <DialogTitle className={'text-2xl text-center font-bold'}>
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className={'p-6'}>
          <Label className={'uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'}>
            Server invite link
          </Label>
          <div className={'flex items-center mt-2 gap-x-2'}>
            <Input
              readOnly
              value={inviteUrl}
              className={'bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'}
              disabled={isLoading}
            />
            <Button
              size={'icon'}
              disabled={isLoading}
              onClick={() => handleCopy()}
            >
              {
                copied
                  ? <Check className={'w-4 h-4'} />
                  : <Copy className={'w-4 h-4'} />
              }
            </Button>
          </div>
          <Button
            variant={'link'}
            size={'sm'}
            className={'text-xs text-zinc-500 mt-4'}
            disabled={isLoading}
            onClick={() => handleGenerateNewLink()}
          >
            Generate a new link
            <RefreshCw className={'w-4 h-4 ml-2'} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal