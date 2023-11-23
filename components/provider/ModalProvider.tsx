'use client'

import { useState, useEffect } from 'react'
import {
  CreateServerModal, EditServerModal, DeleteServerModal, LeaveServerModal, InviteModal,
  MembersModal, CreateChannelModal, EditChannelModal, DeleteChannelModal, MessageFileModal, DeleteMessageModal
} from '@/components/shared/Modal'

const ModalProvider = ({}) => {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <DeleteServerModal />
      <InviteModal />
      <LeaveServerModal />
      <MembersModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}

export default ModalProvider