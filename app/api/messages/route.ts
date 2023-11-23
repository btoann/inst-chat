import { NextResponse } from 'next/server'
import { GV } from '@/config/glob'
import MessageModel from '@/models/message'
import { currentProfile } from '@/lib/current-profile'

const GET = async (req: Request) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!channelId) return new NextResponse('Channel ID missing', { status: 400 })

    const messages = await MessageModel.findMany({
      take: GV.MESSAGES_PER_PAYLOAD,
      ...(cursor != null && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    const nextCursor = messages.length === GV.MESSAGES_PER_PAYLOAD ? messages[GV.MESSAGES_PER_PAYLOAD - 1].id : null

    return NextResponse.json({
      items: messages,
      nextCursor,
    })
  }
  catch (err) {
    console.log('[MESSAGES_POST]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export {
  GET,
}