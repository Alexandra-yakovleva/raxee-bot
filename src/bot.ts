// @ts-ignore
import { format } from 'date-fns';
import { Bot } from 'grammy';
import * as R from 'ramda';

import { DATE_FORMAT } from './constants/dates';
import { errorMessage, pidorMessages } from './constants/messages';
import { getSessionMiddleware } from './middleware/session';
import { ContextWithSession } from './types/session';
import { getMessageVariant } from './utils/message';
import { asyncPause } from './utils/pause';
import { getRandomItem } from './utils/random';
import { getStats } from './utils/stats';

require('dotenv-flow').config();

(async () => {
  const bot = new Bot<ContextWithSession>(process.env.BOT_TOKEN!);
  bot.use(getSessionMiddleware());

  bot.command('pidor_reg', (ctx) => {
    if (!ctx.from) {
      return ctx.reply(errorMessage);
    }

    ctx.session.pidor.users[ctx.from.id] = ctx.from;

    ctx.reply(getMessageVariant(
      ctx.session.pidor.users[ctx.from.id] ? pidorMessages.register.duplicate : pidorMessages.register.added,
      ctx.from,
    ), { parse_mode: 'Markdown' });
  });

  bot.command('pidor', async (ctx) => {
    if (!Object.keys(ctx.session.pidor.users).length) {
      return ctx.reply(getMessageVariant(pidorMessages._.empty, ctx.from), { parse_mode: 'Markdown' });
    }

    const date = format(new Date(), DATE_FORMAT);

    if (ctx.session.pidor.stats[date]) {
      const currentUser = ctx.session.pidor.users[ctx.session.pidor.stats[date]];
      return ctx.reply(getMessageVariant(pidorMessages._.duplicate, currentUser), { parse_mode: 'Markdown' });
    }

    const randomUser = getRandomItem(Object.values(ctx.session.pidor.users));
    ctx.session.pidor.stats[date] = randomUser.id;
    ctx.reply(getMessageVariant(pidorMessages._.found1, randomUser), { parse_mode: 'Markdown' });
    await asyncPause(2500);
    ctx.reply(getMessageVariant(pidorMessages._.found2, randomUser), { parse_mode: 'Markdown' });
    await asyncPause(2500);
    ctx.reply(getMessageVariant(pidorMessages._.found3, randomUser), { parse_mode: 'Markdown' });
    await asyncPause(4000);
    ctx.reply(getMessageVariant(pidorMessages._.found4, randomUser), { parse_mode: 'Markdown' });

    if (date.endsWith('12-31')) {
      await asyncPause(10000);
      ctx.reply(pidorMessages._.newYear(date.slice(0, 4)), { parse_mode: 'Markdown' });
    }
  });

  bot.command('pidor_stats', (ctx) => {
    const stats = getStats(ctx.session.pidor.stats, ctx.session.pidor.users);

    ctx.reply([
      pidorMessages.stats.title(),
      '',
      ...stats.map((item, index) => pidorMessages.stats.row(index, item.user, item.count)),
      '',
      pidorMessages.stats.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'), { parse_mode: 'Markdown' });
  });

  bot.command('pidor_stats_year', (ctx) => {
    const isCurrentYear = R.startsWith(format(new Date(), 'yyyy'));
    const stats = getStats(R.pickBy((_, key) => isCurrentYear(key), ctx.session.pidor.stats), ctx.session.pidor.users);

    ctx.reply([
      pidorMessages.statsYear.title(),
      '',
      ...stats.map((item, index) => pidorMessages.statsYear.row(index, item.user, item.count)),
      '',
      pidorMessages.statsYear.total(Object.keys(ctx.session.pidor.users).length),
    ].join('\n'), { parse_mode: 'Markdown' });
  });

  // TODO: https://grammy.dev/plugins/command-filter.html#plugin-summary
  bot.command('pidor_2021', (ctx) => {
    const stats = getStats(R.pickBy((_, key) => key.startsWith('2021'), ctx.session.pidor.stats), ctx.session.pidor.users);

    if (!stats.length) {
      return ctx.reply(errorMessage);
    }

    ctx.reply(pidorMessages._.year(stats[0].user, '2021'), { parse_mode: 'Markdown' });
  });

  bot.on('message', (ctx) => {
    if (ctx.from.id === ctx.session.pidor.stats[format(new Date(), DATE_FORMAT)] && Math.random() < 0.1) {
      ctx.reply(getMessageVariant(pidorMessages.onMessage.current, ctx.from), {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
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
