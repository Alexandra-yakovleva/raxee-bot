import { Context } from 'grammy';
import { User } from 'grammy/out/platform.node';
import * as R from 'ramda';

import { PidorStatsMessageVariant } from '../types/pidor';

import { isFirstApril } from './date';

export const buildPidorStatsMessageVariant = (statsVariant: PidorStatsMessageVariant) => statsVariant;

export const sendPidorMessage = async (ctx: Context, text: string, reply_to_message_id?: number) => {
  if (isFirstApril()) {
    // eslint-disable-next-line no-param-reassign
    text = text.replace(/дня/g, 'часа');
  }

  await ctx.reply(
    text,
    {
      parse_mode: 'Markdown',
      reply_markup: { remove_keyboard: true },
      reply_to_message_id,
    },
  );
};

export const getPidorStats = (
  items: Record<string, number>,
  users: Record<string, User>,
) => {
  return R.compose<[Record<string, number>], number[], Record<number, number>, Array<[string, number]>, Array<{ user: User, count: number }>, Array<{ user: User, count: number }>>(
    R.sort((left, right) => right.count - left.count),

    R.map((item) => ({
      count: item[1],
      user: users[Number(item[0])],
    })),

    R.toPairs,

    (userIds) => userIds.reduce<Record<number, number>>((acc, userId) => {
      acc[userId] = acc[userId] ? acc[userId] + 1 : 1;
      return acc;
    }, {}),

    R.values,
  )(items);
};
