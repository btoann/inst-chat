'use client'

import { useState } from 'react'
import axios from 'axios'
import qs from 'query-string'
import useModal from '@/hooks/ModalStore'
import {
  Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const DeleteMessageModal = ({}) => {

  const [isLoading, setIsLoading] = useState(false)

  const { data, type, isOpen, onClose } = useModal()

  const isModalOpen = isOpen && type === 'deleteMessage'
  const { apiUrl, query } = data

  const handleDeleteMessage = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query: query as any,
      })
      await axios.delete(url)
      onClose()
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
            Delete Message
          </DialogTitle>
          <DialogDescription className={'text-center text-zinc-500'}>
            Are you sure to perform this action?
            <br />
            The message will be permanently deleted.
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
              onClick={() => handleDeleteMessage()}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMessageModal