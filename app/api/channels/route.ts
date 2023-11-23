import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'
import { GV } from '@/config/glob'
import ServerModel from '@/models/server'
import { currentProfile } from '@/lib/current-profile'

const POST = async (
  req: Request
) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const { name, type } = await req.json()

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })

    if (name === GV.DEFAULT_CHANNEL) return new NextResponse(`Name cannot be '${GV.DEFAULT_CHANNEL}'`, { status: 400 })

    const server = await ServerModel.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[CHANNELS_POST]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export {
  POST
}