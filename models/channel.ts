import { Channel, Profile, Server } from '@prisma/client'
import { db } from '@/lib/db'

export interface IChannel extends Channel {
  profile: Profile
  server: Server
}

const ChannelModel = db.channel

export default ChannelModel