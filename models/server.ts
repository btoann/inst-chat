import { Server } from '@prisma/client'
import { db } from '@/lib/db'
import { IMember } from './member'

export interface IServer extends Server {
  members: IMember[]
}

const ServerModel = db.server

export default ServerModel