import { Server, Member, Profile } from '@prisma/client'

export interface IServer extends Server {
  members: (Member & {
    profile: Profile
  })[]
}