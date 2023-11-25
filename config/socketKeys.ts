import { ChatMessagesType } from './glob'

export class SOCKET_CHAT_KEYS {

  static ADD (type: ChatMessagesType, chatId: string) {
    return `chat:${type}:${chatId}:messages`
  }

  static UPDATE (type: ChatMessagesType, chatId: string) {
    return `chat:${type}:${chatId}:messages:update`
  }

}