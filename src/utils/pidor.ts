import { User } from 'grammy/out/platform.node';
import * as R from 'ramda';

import { PidorStatsMessageVariant } from '../types/pidor';

export const buildPidorStatsMessageVariant = (statsVariant: PidorStatsMessageVariant) => statsVariant;

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
