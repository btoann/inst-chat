'use client'

import { FC, useState, useEffect } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { useUser } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import { Channel } from '@prisma/client'

type TMediaRoomProps = {
  chatId: string
  video: boolean
  audio: boolean
}

const MediaRoom: FC<TMediaRoomProps> = ({
  chatId, video, audio
}) => {

  const [token, setToken] = useState('')
  const { user } = useUser()

  useEffect(() => {
    if (!user?.firstName || !user.lastName) return

    const name = `${user.firstName} ${user.lastName}`

    ;(async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
        const data = await res.json()
        setToken(data.token)
      }
      catch (err) {
        console.log(err)
      }
    })()
  }, [user?.firstName, user?.lastName, chatId])

  if (token === '' || token == null) return (
    <div className={'flex flex-1 flex-col justify-center items-center'}>
      <Loader className={'h-7 w-7 my-4 text-zinc-500 animate-spin'} />
      <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>
        Loading...
      </p>
    </div>
  )

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      
    </LiveKitRoom>
  )
}

export default MediaRoom