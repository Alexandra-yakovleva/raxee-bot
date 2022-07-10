import { format } from 'date-fns';
import { User } from 'grammy/out/platform.node';
import * as R from 'remeda';

import { PidorStatsMessageVariant } from '../types/pidor';

import { isFirstApril } from './date';

export const buildPidorStatsMessageVariant = (statsVariant: PidorStatsMessageVariant) => statsVariant;

export const getPidorCurrentDate = () => {
  if (isFirstApril()) {
    return format(new Date(), 'yyyy-MM-dd-HH');
  }

  return format(new Date(), 'yyyy-MM-dd');
};

export const getPidorStats = (
  items: Record<string, number>,
  users: Record<string, User>,
) => {
  return R.pipe(
    items,
    R.values,

    (userIds) => userIds.reduce<Record<string, number>>((acc, userId) => {
      acc[userId] = acc[userId] ? acc[userId] + 1 : 1;
      return acc;
    }, {}),

    R.toPairs,

    R.map((item) => ({
      count: item[1],
      user: users[item[0]],
    })),

    R.sort((a, b) => b.count - a.count),
  );
};
