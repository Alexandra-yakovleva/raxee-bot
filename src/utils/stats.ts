import * as R from 'ramda'
import {Context} from 'telegraf'
import {PIDOR} from '../constants/messages'
import {sendMessage} from './message'
import {User} from 'typegram'

export const sendStats = (ctx: Context, items: Record<string, number>, users: Record<string, User>) => {
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
      user : users[Number(item[0])],
    })),

    R.toPairs,

    userIds => userIds.reduce<Record<number, number>>((acc, userId) => {
      acc[userId] = acc[userId] ? acc[userId] + 1 : 1
      return acc
    }, {}),

    R.values,
  )(items)

  const statsRows = [
    PIDOR.STATS.TITLE,
    '',
    ...stats.map((item, index) => PIDOR.STATS.ROW(index, item.user, item.count)),
    '',
    PIDOR.STATS.TOTAL(Object.keys(users).length),
  ]

  sendMessage(ctx, statsRows.join('\n'))
}
