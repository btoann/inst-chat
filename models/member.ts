import { Member, Profile } from '@prisma/client'
import { db } from '@/lib/db'

export interface IMember extends Member {
  profile: Profile
}

const MemberModel = db.member

export default MemberModel