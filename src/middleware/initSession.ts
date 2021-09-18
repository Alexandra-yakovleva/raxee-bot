import {ContextWithSession} from '../types/session'

export const initSession = async (ctx: ContextWithSession, next: Function) => {
  if(!ctx.session.pidor) {
    ctx.session.pidor = {
      stats: {},
      users: {},
    }
  }

  if(!ctx.session.pidor.stats) {
    ctx.session.pidor.stats = {}
  }

  if(!ctx.session.pidor.users) {
    ctx.session.pidor.users = {}
  }

  return next()
}
