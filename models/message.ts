import { Message } from '@prisma/client'
import { IMember } from './member'
import { db } from '@/lib/db'

export interface IMessage extends Message {
  member: IMember
}

const MessageModel = db.$extends({
  result: {
    message: {
      content: {
        needs: {
          content: true,
        },
        compute (message: Message) {
          return !message.deleted ? message.content : 'This message has been deleted.'
        },
      }
    }
  }
}).message

export default MessageModel