import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'
import { GV } from '@/config/glob'
import ServerModel from '@/models/server'
import { currentProfile } from '@/lib/current-profile'

const PATCH = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })
    if (!params.channelId) return new NextResponse('Channel ID missing', { status: 400 })

    const { name, type } = await req.json()

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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: GV.DEFAULT_CHANNEL,
              }
            },
            data: {
              name,
              type,
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[CHANNEL_ID_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })
    if (!params.channelId) return new NextResponse('Channel ID missing', { status: 400 })

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
          delete: {
            id: params.channelId,
            name: {
              not: GV.DEFAULT_CHANNEL,
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[CHANNEL_ID_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


export {
  PATCH,
  DELETE,
}