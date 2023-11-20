import { NextApiRequest } from 'next'
import { auth } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

const currentProfile = async () => {
  const { userId } = auth()

  if (!userId) return null

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}

const currentProfileViaPages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req)

  if (!userId) return null

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  })

  return profile
}

export {
  currentProfile,
  currentProfileViaPages,
}