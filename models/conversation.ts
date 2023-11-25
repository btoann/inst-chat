import { Conversation, Member } from '@prisma/client'
import { db } from '@/lib/db'

export interface IConversation extends Conversation {
  memberOne: Member
  memberTwo: Member
}

const ConversationModel = db.conversation

export default ConversationModel