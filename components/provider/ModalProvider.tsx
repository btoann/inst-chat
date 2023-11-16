'use client'

import { useState, useEffect } from 'react'
import { CreateServerModal, EditServerModal, InviteModal, MembersModal } from '@/components/shared/Modal'

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
      <InviteModal />
      <MembersModal />
    </>
  )
}

export default ModalProvider