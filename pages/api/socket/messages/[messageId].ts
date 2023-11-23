import { NextApiRequest } from 'next'
import { MemberRole, Message } from '@prisma/client'
import { NextApiResponseServerIO } from '@/config/glob'
import ServerModel from '@/models/server'
import ChannelModel from '@/models/channel'
import MessageModel from '@/models/message'
import { currentProfileViaPages } from '@/lib/current-profile'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed.' })

  try {
    const profile = await currentProfileViaPages(req)

    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { serverId, channelId, messageId } = req.query

    if (!serverId) return res.status(400).json({ error: 'Server ID missing' })
    if (!channelId) return res.status(400).json({ error: 'Channel ID missing' })

    const server = await ServerModel.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      }
    })
    
    if (!server) return res.status(404).json({ error: 'Server not found' })

    const channel = await ChannelModel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      }
    })

    if (!channel) return res.status(404).json({ error: 'Channel not found' })

    const member = server.members.find(member => member.profileId === profile.id)

    if (!member) return res.status(404).json({ error: 'Member not found' })

    let message = await MessageModel.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })
    
    if (!message || message.deleted) return res.status(404).json({ error: 'Message not found' })

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const isAbleToModify = isMessageOwner || isAdmin || isModerator

    if (!isAbleToModify) return res.status(401).json({ error: 'Unauthorized' })

    if (req.method === 'DELETE') {
      message = await MessageModel.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          // content: 'This message has been deleted.',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }

    if (req.method === 'PATCH') {
      
      const { content } = req.body

      if (!content) return res.status(400).json({ error: 'No content found' })
      if (!isMessageOwner) return res.status(401).json({ error: 'Unauthorized' })

      message = await MessageModel.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }

    const updateKey = `chat:${channelId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  }
  catch (err) {
    console.log('[MESSAGES_ID]', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler