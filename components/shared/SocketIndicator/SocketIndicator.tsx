'use client'

import { useSocketContext } from '@/components/provider/SocketProvider'
import { Badge } from '@/components/ui/badge'

const SocketIndicator = () => {

  const { isConnected } = useSocketContext()

  if (!isConnected) return (
    <Badge
      variant={'outline'}
      className={'border-none bg-yellow-600 text-white'}
    >
      Fallback: Polling every 1s
    </Badge>
  )

  return (
    <Badge
      variant={'outline'}
      className={'border-none bg-emerald-600 text-white'}
    >
      Live: Real-time updates
    </Badge>
  )
}

export default SocketIndicator