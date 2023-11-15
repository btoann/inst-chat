import { create } from 'zustand'

type ModalType = 'createServer'

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  onOpen: (type: ModalType) => void
  onClose: () => void
}

const useModal = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null }),
}))

export {
  type ModalType,
}

export default useModal