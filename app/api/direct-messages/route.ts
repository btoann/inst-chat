import { NextResponse } from 'next/server'
import { GV } from '@/config/glob'
import DirectMessageModel from '@/models/directMessage'
import { currentProfile } from '@/lib/current-profile'

const GET = async (req: Request) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) return new NextResponse('Conversation ID missing', { status: 400 })

    const messages = await DirectMessageModel.findMany({
      take: GV.MESSAGES_PER_PAYLOAD,
      ...(cursor != null && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      where: {
        conversationId,
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
    console.log('[DIRECT_MESSAGES_GET]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export {
  GET,
}