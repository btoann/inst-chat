import { NextResponse } from 'next/server'
import ServerModel from '@/models/server'
import { currentProfile } from '@/lib/current-profile'

const PATCH = async (
  req: Request,
  { params }: { params : { serverId: string } }
) => {
  try {

    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    if (!params.serverId) return new NextResponse('Server ID missing', { status: 400 })

    const server = await ServerModel.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          }
        }
      }
    })

    return NextResponse.json(server)
  }
  catch (err) {
    console.error('[SERVER_ID_LEAVE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export {
  PATCH,
}