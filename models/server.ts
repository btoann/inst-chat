import { Server } from '@prisma/client'
import { IMember } from './member'

export interface IServer extends Server {
  members: IMember[]
}
