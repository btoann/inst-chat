import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { ReactNode } from 'react'
import { Server as SocketIOServer } from 'socket.io'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type IconMap<T extends string> = Partial<Record<T, ReactNode | null>>

// Global variables
export class GV {
  static DATE_FORMAT = 'd MMM yyyy, HH:mm'

  static DEFAULT_CHANNEL = 'general'
  static MESSAGES_PER_PAYLOAD = 10
}