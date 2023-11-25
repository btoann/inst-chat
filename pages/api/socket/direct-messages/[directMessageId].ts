import { NextApiRequest } from 'next'
import { MemberRole } from '@prisma/client'
import { NextApiResponseServerIO } from '@/config/glob'
import { SOCKET_CHAT_KEYS } from '@/config/socketKeys'
import ConversationModel from '@/models/conversation'
import DirectMessageModel from '@/models/directMessage'
import { currentProfileViaPages } from '@/lib/current-profile'

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed.' })

  try {
    const profile = await currentProfileViaPages(req)

    if (!profile) return res.status(401).json({ error: 'Unauthorized' })

    const { conversationId, directMessageId } = req.query

    if (!conversationId) return res.status(400).json({ error: 'Conversation ID missing' })

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

    let directMessage = await DirectMessageModel.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })
    
    if (!directMessage || directMessage.deleted) return res.status(404).json({ error: 'Message not found' })

    const isMessageOwner = directMessage.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const isAbleToModify = isMessageOwner || isAdmin || isModerator

    if (!isAbleToModify) return res.status(401).json({ error: 'Unauthorized' })

    if (req.method === 'DELETE') {
      directMessage = await DirectMessageModel.update({
        where: {
          id: directMessageId as string,
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

      directMessage = await DirectMessageModel.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = SOCKET_CHAT_KEYS.UPDATE('conversation', conversation.id)

    res?.socket?.server?.io?.emit(updateKey, directMessage)

    return res.status(200).json(directMessage)
  }
  catch (err) {
    console.log('[MESSAGES_ID]', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler