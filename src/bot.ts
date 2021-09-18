// @ts-ignore
require('dotenv-flow').config()

import * as R from 'ramda'
import {asyncPause} from './utils/pause'
import {ContextWithSession} from './types/session'
import {DATE_FORMAT} from './constants/dates'
import {format} from 'date-fns'
import {getRandomItem} from './utils/random'
import {initSession} from './middleware/initSession'
import LocalSession from 'telegraf-session-local'
import {PIDOR} from './constants/messages'
import {sendMessage} from './utils/message'
import {Telegraf} from 'telegraf'
import {User} from 'typegram'

const bot = new Telegraf<ContextWithSession>(process.env.BOT_TOKEN!)

bot.use(new LocalSession({
  database     : process.env.DB_PATH,
  getSessionKey: ctx => String(ctx.chat?.id || ctx.from?.id || 0),
}).middleware())

bot.use(initSession)

bot.command('pidor_reg', ctx => {
  if(ctx.session.pidor.users[ctx.from.id]) {
    return sendMessage(ctx, PIDOR.REG.DUPLICATE)
  }

  ctx.session.pidor.users[ctx.from.id] = ctx.from
  return sendMessage(ctx, getRandomItem(PIDOR.REG.ADDED)(ctx.from))
})

bot.command('pidor', async ctx => {
  if(!Object.keys(ctx.session.pidor.users).length) {
    return sendMessage(ctx, PIDOR._.EMPTY)
  }

  const date = format(new Date, DATE_FORMAT)

  if(ctx.session.pidor.stats[date]) {
    return sendMessage(ctx, PIDOR._.DUPLICATE(ctx.session.pidor.users[ctx.session.pidor.stats[date]]))
  }

  const randomUserId = Number(getRandomItem(Object.keys(ctx.session.pidor.users)))
  ctx.session.pidor.stats[date] = randomUserId
  sendMessage(ctx, getRandomItem(PIDOR._.FOUND1))
  await asyncPause(2500)
  sendMessage(ctx, getRandomItem(PIDOR._.FOUND2))
  await asyncPause(2500)
  sendMessage(ctx, getRandomItem(PIDOR._.FOUND3))
  await asyncPause(4000)
  return sendMessage(ctx, getRandomItem(PIDOR._.FOUND4)(ctx.session.pidor.users[randomUserId]))
})

bot.command('pidor_stats', ctx => {
  const stats = R.compose<
    Record<string, number>,
    number[],
    Record<number, number>,
    Array<[string, number]>,
    Array<{user: User, count: number}>,
    Array<{user: User, count: number}>
  >(
    R.sort((left, right) => right.count - left.count),

    R.map(item => ({
      count: item[1],
      user : ctx.session.pidor.users[Number(item[0])],
    })),

    R.toPairs,

    userIds => userIds.reduce<Record<number, number>>((acc, userId) => {
      acc[userId] = acc[userId] ? acc[userId] + 1 : 1
      return acc
    }, {}),

    R.values,
  )(ctx.session.pidor.stats)

  const statsRows = [
    PIDOR.STATS.TITLE,
    '',
    ...stats.map((item, index) => PIDOR.STATS.ROW(index, item.user, item.count)),
    '',
    PIDOR.STATS.TOTAL(Object.keys(ctx.session.pidor.users).length),
  ]

  return sendMessage(ctx, statsRows.join('\n'))
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
