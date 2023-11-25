import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/config/glob'
import { SOCKET_CHAT_KEYS } from '@/config/socketKeys'
import { currentProfileViaPages } from '@/lib/current-profile'
import ConversationModel from '@/models/conversation'
import DirectMessageModel from '@/models/directMessage'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  try {
    const profile = await currentProfileViaPages(req)

    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { conversationId } = req.query

    if (!conversationId) return res.status(400).json({ error: 'Conversation ID missing' })
    
    const { content, fileUrl } = req.body

    if (!content) return res.status(400).json({ error: 'No content found' })

    const conversation = await ConversationModel.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            }
          },
          {
            memberTwo: {
              profileId: profile.id,
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          }
        },
        memberTwo: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' })

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

    if (!member) return res.status(404).json({ error: 'Member not found' })

    const message = await DirectMessageModel.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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

    const conversationKey = SOCKET_CHAT_KEYS.ADD('conversation', conversationId as string)

    res?.socket?.server?.io?.emit(conversationKey, message)

    return res.status(200).json(message)
  }
  catch (err) {
    console.log('[DIRECT_MESSAGES_POST]', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler