import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/config/glob'
import ServerModel from '@/models/server'
import ChannelModel from '@/models/channel'
import MessageModel from '@/models/message'
import { currentProfileViaPages } from '@/lib/current-profile'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  try {
    const profile = await currentProfileViaPages(req)

    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { serverId, channelId } = req.query

    if (!serverId) return res.status(400).json({ error: 'Server ID missing' })
    if (!channelId) return res.status(400).json({ error: 'Channel ID missing' })
    
    const { content, fileUrl } = req.body

    if (!content) return res.status(400).json({ error: 'No content found' })

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

    const message = await MessageModel.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    const channelKey = `chat:${channelId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  }
  catch (err) {
    console.log('[MESSAGES_POST]', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler