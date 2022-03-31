// @ts-ignore
import { format } from 'date-fns';
import { Bot } from 'grammy';
import * as R from 'ramda';

import { errorMessage, pidorMessages } from './constants/messages';
import { getSessionMiddleware } from './middleware/session';
import { ContextWithSession } from './types/session';
import { getCurrentDate } from './utils/date';
import { getMessageVariant, sendMessage } from './utils/message';
import { asyncPause } from './utils/pause';
import { getRandomItem } from './utils/random';
import { getStats } from './utils/stats';

require('dotenv-flow').config();

(async () => {
  const bot = new Bot<ContextWithSession>(process.env.BOT_TOKEN!);
  bot.use(getSessionMiddleware());

  bot.command('pidor_reg', async (ctx) => {
    if (!ctx.from) {
      await sendMessage(ctx, errorMessage);
      return;
    }

    const alreadyRegistered = Boolean(ctx.session.pidor.users[ctx.from.id]);

    ctx.session.pidor.users[ctx.from.id] = ctx.from;

    await sendMessage(ctx, getMessageVariant(
      alreadyRegistered ? pidorMessages.register.duplicate : pidorMessages.register.added,
      ctx.from,
    ));
  });

  bot.command('pidor', async (ctx) => {
    if (!Object.keys(ctx.session.pidor.users).length) {
      await sendMessage(ctx, getMessageVariant(pidorMessages._.empty, ctx.from));
      return;
    }

    const date = getCurrentDate();

    if (ctx.session.pidor.stats[date]) {
      const currentUser = ctx.session.pidor.users[ctx.session.pidor.stats[date]];
      await sendMessage(ctx, getMessageVariant(pidorMessages._.duplicate, currentUser));
      return;
    }

    const randomUser = getRandomItem(Object.values(ctx.session.pidor.users));
    ctx.session.pidor.stats[date] = randomUser.id;
    await sendMessage(ctx, getMessageVariant(pidorMessages._.found1, randomUser));
    await asyncPause(2500);
    await sendMessage(ctx, getMessageVariant(pidorMessages._.found2, randomUser));
    await asyncPause(2500);
    await sendMessage(ctx, getMessageVariant(pidorMessages._.found3, randomUser));
    await asyncPause(4000);
    await sendMessage(ctx, getMessageVariant(pidorMessages._.found4, randomUser));

    if (date.endsWith('12-31')) {
      await asyncPause(10000);
      await sendMessage(ctx, pidorMessages._.newYear(date.slice(0, 4)));
    }
  });

  bot.command('pidor_stats', async (ctx) => {
    const stats = getStats(ctx.session.pidor.stats, ctx.session.pidor.users);

    await sendMessage(ctx, [
      pidorMessages.stats.title(),
      '',
      ...stats.map((item, index) => pidorMessages.stats.row(index, item.user, item.count)),
      '',
      pidorMessages.stats.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'));
  });

  bot.command('pidor_stats_year', async (ctx) => {
    const isCurrentYear = R.startsWith(format(new Date(), 'yyyy'));
    const stats = getStats(R.pickBy((_, key) => isCurrentYear(key), ctx.session.pidor.stats), ctx.session.pidor.users);

    await sendMessage(ctx, [
      pidorMessages.statsYear.title(),
      '',
      ...stats.map((item, index) => pidorMessages.statsYear.row(index, item.user, item.count)),
      '',
      pidorMessages.statsYear.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'));
  });

  // TODO: https://grammy.dev/plugins/command-filter.html#plugin-summary
  bot.command('pidor_2021', async (ctx) => {
    const stats = getStats(R.pickBy((_, key) => key.startsWith('2021'), ctx.session.pidor.stats), ctx.session.pidor.users);

    if (!stats.length) {
      await sendMessage(ctx, errorMessage);
      return;
    }

    await sendMessage(ctx, pidorMessages._.year(stats[0].user, '2021'));
  });

  bot.on('message', async (ctx) => {
    if (ctx.from.id === ctx.session.pidor.stats[getCurrentDate()] && Math.random() < 0.1) {
      await sendMessage(ctx, getMessageVariant(pidorMessages.onMessage.current, ctx.from), ctx.message.message_id);
    }
  });

  bot.start();

  await bot.api.setMyCommands([
    { command: 'pidor', description: 'Определить пидора дня' },
    { command: 'pidor_reg', description: 'Стать участником пидора дня' },
    { command: 'pidor_stats', description: 'Посмотреть статистику пидора дня' },
    { command: 'pidor_stats_year', description: 'Посмотреть статистику пидора дня за текущий год' },
  ]);
})();
