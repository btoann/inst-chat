import ChatHeader from './Chat.Header'
import ChatInput from './Chat.Input'
import ChatMessages from './Chat.Messages'
import ChatVideoTrigger from './Chat.VideoTrigger'

const Chat = (() => ({
  Header: ChatHeader,
  Input: ChatInput,
  Messages: ChatMessages,
  VideoTrigger: ChatVideoTrigger,
}))()

export default Chat