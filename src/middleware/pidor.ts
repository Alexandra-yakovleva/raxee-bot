import { format } from 'date-fns';
import { Composer } from 'grammy';
import * as R from 'ramda';

import { errorMessage, pidorMessages } from '../constants/messages';
import { ContextWithSession } from '../types/session';
import { getCurrentDate } from '../utils/date';
import { getMessageVariant } from '../utils/message';
import { asyncPause } from '../utils/pause';
import { getPidorStats, sendPidorMessage } from '../utils/pidor';
import { getRandomItem } from '../utils/random';

export const getPidorMiddleware = () => {
  const bot = new Composer<ContextWithSession>();

  bot.command('pidor', async (ctx, next) => {
    if (!Object.keys(ctx.session.pidor.users).length) {
      await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.empty, ctx.from));
      return next();
    }

    const date = getCurrentDate();

    if (ctx.session.pidor.stats[date]) {
      const currentUser = ctx.session.pidor.users[ctx.session.pidor.stats[date]];
      await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.duplicate, currentUser));
      return next();
    }

    const randomUser = getRandomItem(Object.values(ctx.session.pidor.users));
    ctx.session.pidor.stats[date] = randomUser.id;
    await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.found1, randomUser));
    await asyncPause(2500);
    await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.found2, randomUser));
    await asyncPause(2500);
    await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.found3, randomUser));
    await asyncPause(4000);
    await sendPidorMessage(ctx, getMessageVariant(pidorMessages._.found4, randomUser));

    if (date.endsWith('12-31')) {
      await asyncPause(10000);
      await sendPidorMessage(ctx, pidorMessages._.newYear(date.slice(0, 4)));
    }

    return next();
  });

  bot.command('pidor_reg', async (ctx, next) => {
    if (!ctx.from) {
      await sendPidorMessage(ctx, errorMessage);
      return next();
    }

    const alreadyRegistered = Boolean(ctx.session.pidor.users[ctx.from.id]);

    ctx.session.pidor.users[ctx.from.id] = ctx.from;

    await sendPidorMessage(ctx, getMessageVariant(
      alreadyRegistered ? pidorMessages.register.duplicate : pidorMessages.register.added,
      ctx.from,
    ));

    return next();
  });

  bot.command('pidor_stats', async (ctx, next) => {
    const stats = getPidorStats(ctx.session.pidor.stats, ctx.session.pidor.users);

    await sendPidorMessage(ctx, [
      pidorMessages.stats.title(),
      '',
      ...stats.map((item, index) => pidorMessages.stats.row(index, item.user, item.count)),
      '',
      pidorMessages.stats.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'));

    return next();
  });

  bot.command('pidor_stats_year', async (ctx, next) => {
    const isCurrentYear = R.startsWith(format(new Date(), 'yyyy'));
    const stats = getPidorStats(R.pickBy((_, key) => isCurrentYear(key), ctx.session.pidor.stats), ctx.session.pidor.users);

    await sendPidorMessage(ctx, [
      pidorMessages.statsYear.title(),
      '',
      ...stats.map((item, index) => pidorMessages.statsYear.row(index, item.user, item.count)),
      '',
      pidorMessages.statsYear.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'));

    return next();
  });

  // TODO: https://grammy.dev/plugins/command-filter.html#plugin-summary
  bot.command('pidor_2021', async (ctx, next) => {
    const stats = getPidorStats(R.pickBy((_, key) => key.startsWith('2021'), ctx.session.pidor.stats), ctx.session.pidor.users);

    if (!stats.length) {
      await sendPidorMessage(ctx, errorMessage);
      return next();
    }

    await sendPidorMessage(ctx, pidorMessages._.year(stats[0].user, '2021'));

    return next();
  });

  bot.on('message', async (ctx, next) => {
    if (ctx.from.id === ctx.session.pidor.stats[getCurrentDate()] && Math.random() < 0.1) {
      await sendPidorMessage(ctx, getMessageVariant(pidorMessages.onMessage.current, ctx.from), ctx.message.message_id);
    }

    return next();
  });

  return bot;
};
