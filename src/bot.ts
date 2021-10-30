// @ts-ignore
require('dotenv-flow').config()

import {getMessageVariant, sendMessage} from './utils/message'
import {asyncPause} from './utils/pause'
import {ContextWithSession} from './types/session'
import {DATE_FORMAT} from './constants/dates'
import {format} from 'date-fns'
import {getRandomItem} from './utils/random'
import {initSession} from './middleware/initSession'
import LocalSession from 'telegraf-session-local'
import {PIDOR} from './constants/messages'
import {sendStats} from './utils/stats'
import {Telegraf} from 'telegraf'

const bot = new Telegraf<ContextWithSession>(process.env.BOT_TOKEN!)

bot.use(new LocalSession({
  database     : process.env.DB_PATH,
  getSessionKey: ctx => String(ctx.chat?.id || ctx.from?.id || 0),
}).middleware())

bot.use(initSession)

bot.command('pidor_reg', ctx => {
  if(ctx.session.pidor.users[ctx.from.id]) {
    return sendMessage(ctx, getMessageVariant(PIDOR.REG.DUPLICATE, ctx.from))
  }

  ctx.session.pidor.users[ctx.from.id] = ctx.from
  sendMessage(ctx, getMessageVariant(PIDOR.REG.ADDED, ctx.from))
})

bot.command('pidor', async ctx => {
  if(!Object.keys(ctx.session.pidor.users).length) {
    return sendMessage(ctx, getMessageVariant(PIDOR._.EMPTY, ctx.from))
  }

  const date = format(new Date, DATE_FORMAT)

  if(ctx.session.pidor.stats[date]) {
    const currentUser = ctx.session.pidor.users[ctx.session.pidor.stats[date]]
    return sendMessage(ctx, getMessageVariant(PIDOR._.DUPLICATE, currentUser))
  }

  const randomUser = getRandomItem(Object.values(ctx.session.pidor.users))
  ctx.session.pidor.stats[date] = randomUser.id
  sendMessage(ctx, getMessageVariant(PIDOR._.FOUND1, randomUser))
  await asyncPause(2500)
  sendMessage(ctx, getMessageVariant(PIDOR._.FOUND2, randomUser))
  await asyncPause(2500)
  sendMessage(ctx, getMessageVariant(PIDOR._.FOUND3, randomUser))
  await asyncPause(4000)
  sendMessage(ctx, getMessageVariant(PIDOR._.FOUND4, randomUser))
})

bot.command('pidor_stats', ctx => {
  sendStats(ctx, ctx.session.pidor.stats, ctx.session.pidor.users)
})

bot.on('message', ctx => {
  if(ctx.from.id === ctx.session.pidor.stats[format(new Date, DATE_FORMAT)] && Math.random() < .1) {
    sendMessage(ctx, getMessageVariant(PIDOR.ON_MESSAGE.CURRENT, ctx.from), ctx.message.message_id)
  }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
