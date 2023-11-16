import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    const { role } = await req.json()

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })
    if (!params.memberId) return new NextResponse('Member ID missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[MEMBER_ID_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


const DELETE = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })
    if (!params.memberId) return new NextResponse('Member ID missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[MEMBER_ID_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


export {
  PATCH,
  DELETE,
}