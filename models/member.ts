import { Member, Profile } from '@prisma/client'

export interface IMember extends Member {
  profile: Profile
}
