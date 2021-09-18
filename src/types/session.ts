import {Context} from 'telegraf'
import {User} from 'typegram'

export type Pidor = {
  stats: Record<string, number>
  users: Record<number, User>
}

export type SessionData = {
  pidor: Pidor
}

export type ContextWithSession = Context & {
  session: SessionData
}
