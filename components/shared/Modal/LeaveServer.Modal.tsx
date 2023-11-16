'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import useModal from '@/hooks/ModalStore'
import {
  Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const LeaveServerModal = ({}) => {

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { data, type, isOpen, onClose } = useModal()

  const isModalOpen = isOpen && type === 'leaveServer'
  const { server } = data

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.push('/')
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
            Leave Server
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500'}>
            Are you sure you want to leave
            &thinsp;
            <span className={'font-semibold text-indigo-500'}>{server?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={'px-6 py-4 bg-gray-100'}>
          <div className={'w-full flex items-center justify-between'}>
            <Button
              variant={'ghost'}
              className={''}
              disabled={isLoading}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              variant={'primary'}
              className={''}
              disabled={isLoading}
              onClick={() => handleLeaveServer()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal