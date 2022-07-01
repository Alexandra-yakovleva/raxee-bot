import { format } from 'date-fns';
import { Composer } from 'grammy';
import * as R from 'ramda';

import { errorMessage, pidorMessages } from '../constants/messages';
import { CustomContext } from '../types/context';
import { getCurrentDate } from '../utils/date';
import { getMessageVariant } from '../utils/message';
import { asyncPause } from '../utils/pause';
import { getPidorStats } from '../utils/pidor';
import { getRandomItem } from '../utils/random';

export const getPidorModule = () => {
  const bot = new Composer<CustomContext>();

  bot.command('pidor', async (ctx) => {
    if (!Object.keys(ctx.pidor.users).length) {
      await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.empty, ctx.from));
      return;
    }

    const date = getCurrentDate();

    if (ctx.pidor.stats[date]) {
      const currentUser = ctx.pidor.users[ctx.pidor.stats[date]];
      await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.duplicate, currentUser));
      return;
    }

    const randomUser = getRandomItem(Object.values(ctx.pidor.users));
    ctx.pidor.stats[date] = randomUser.id;
    await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.found1, randomUser));
    await asyncPause(2500);
    await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.found2, randomUser));
    await asyncPause(2500);
    await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.found3, randomUser));
    await asyncPause(4000);
    await ctx.replyWithMarkdown(getMessageVariant(pidorMessages._.found4, randomUser));

    if (date.endsWith('12-31')) {
      await asyncPause(10000);
      await ctx.replyWithMarkdown(pidorMessages._.newYear(date.slice(0, 4)));
    }
  });

  bot.command('pidor_reg', async (ctx) => {
    if (!ctx.from) {
      await ctx.replyWithMarkdown(errorMessage);
      return;
    }

    const alreadyRegistered = Boolean(ctx.pidor.users[ctx.from.id]);

    ctx.pidor.users[ctx.from.id] = ctx.from;

    await ctx.replyWithMarkdown(getMessageVariant(
      alreadyRegistered ? pidorMessages.register.duplicate : pidorMessages.register.added,
      ctx.from,
    ));
  });

  bot.command('pidor_stats', async (ctx) => {
    const stats = getPidorStats(ctx.pidor.stats, ctx.pidor.users);

    await ctx.replyWithMarkdown([
      pidorMessages.stats.title(),
      '',
      ...stats.map((item, index) => pidorMessages.stats.row(index, item.user, item.count)),
      '',
      pidorMessages.stats.total(Object.keys(ctx.pidor.users).length),
    ].join('\n'));
  });

  bot.command('pidor_stats_year', async (ctx) => {
    const isCurrentYear = R.startsWith(format(new Date(), 'yyyy'));
    const stats = getPidorStats(R.pickBy((_, key) => isCurrentYear(key), ctx.pidor.stats), ctx.pidor.users);

    await ctx.replyWithMarkdown([
      pidorMessages.statsYear.title(),
      '',
      ...stats.map((item, index) => pidorMessages.statsYear.row(index, item.user, item.count)),
      '',
      pidorMessages.statsYear.total(Object.keys(ctx.pidor.users).length),
    ].join('\n'));
  });

  // TODO: https://grammy.dev/plugins/command-filter.html
  bot.command('pidor_2021', async (ctx) => {
    const stats = getPidorStats(R.pickBy((_, key) => key.startsWith('2021'), ctx.pidor.stats), ctx.pidor.users);

    if (!stats.length) {
      await ctx.replyWithMarkdown(errorMessage);
      return;
    }

    await ctx.replyWithMarkdown(pidorMessages._.year(stats[0].user, '2021'));
  });

  bot.on('message', async (ctx, next) => {
    if (ctx.from.id === ctx.pidor.stats[getCurrentDate()] && Math.random() < 0.1) {
      await ctx.replyWithMarkdown(getMessageVariant(pidorMessages.onMessage.current, ctx.from), { reply_to_message_id: ctx.message.message_id });
    }

    next();
  });

  return bot;
};
