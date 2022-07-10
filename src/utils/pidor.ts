import { User } from 'grammy/out/platform.node';
import * as R from 'remeda';

import { PidorStatsMessageVariant } from '../types/pidor';

export const buildPidorStatsMessageVariant = (statsVariant: PidorStatsMessageVariant) => statsVariant;

export const getPidorStats = (
  items: Record<string, number>,
  users: Record<string, User>,
) => {
  return R.pipe(
    items,
    R.values,

    (userIds) => userIds.reduce<Record<number, number>>((acc, userId) => {
      acc[userId] = acc[userId] ? acc[userId] + 1 : 1;
      return acc;
    }, {}),

    R.toPairs,

    R.map((item) => ({
      count: item[1],
      user: users[Number(item[0])],
    })),

    R.sort((left, right) => right.count - left.count),
  );
};
