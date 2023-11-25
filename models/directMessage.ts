import { DirectMessage } from '@prisma/client'
import { IMember } from './member'
import { db } from '@/lib/db'

export interface IDirectMessage extends DirectMessage {
  member: IMember
}

const DirectMessageModel = db.$extends({
  result: {
    directMessage: {
      content: {
        needs: {
          content: true,
        },
        compute (thisMessage: DirectMessage) {
          return !thisMessage.deleted ? thisMessage.content : 'This message has been deleted.'
        },
      }
    }
  }
}).directMessage

export default DirectMessageModel