import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/config/queryKeys'
import { IMessage } from '@/models/message'
import { useSocketContext } from '@/components/provider/SocketProvider'

type TChatSocketProps = {
  chatId: string
  addKey: string
  updateKey: string
}

const useChatSocket = ({
  chatId, addKey, updateKey,
}: TChatSocketProps) => {

  const { socket } = useSocketContext()

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    socket.on(updateKey, (message: IMessage) => {
      queryClient.setQueryData(
        [QUERY_KEYS.CHAT, chatId],
        (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData
          const newData = oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: IMessage) => (item.id === message.id) ? message : item)
          }))

          return {
            ...oldData,
            pages: newData,
          }
        }
      )
    })

    socket.on(addKey, (message: IMessage) => {
      queryClient.setQueryData(
        [QUERY_KEYS.CHAT, chatId],
        (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return {
            pages: [{
              items: [message],
            }]
          }

          const newData = [...oldData.pages]

          newData[0] = {
            ...newData[0],
            items: [
              message,
              ...newData[0].items,
            ]
          }

          return {
            ...oldData,
            pages: newData,
          }
        }
      )
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, chatId, socket, updateKey])

}

export {
  useChatSocket,
}