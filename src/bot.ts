import { Bot } from 'grammy';

import { getPidorMiddleware } from './middleware/pidor';
import { getSessionMiddleware } from './middleware/session';
import { ContextWithSession } from './types/session';

require('dotenv-flow').config();

(async () => {
  const bot = new Bot<ContextWithSession>(process.env.BOT_TOKEN!);
  bot.use(getSessionMiddleware());
  bot.use(getPidorMiddleware());

  bot.start();

  await bot.api.setMyCommands([
    { command: 'pidor', description: 'Определить пидора дня' },
    { command: 'pidor_reg', description: 'Стать участником пидора дня' },
    { command: 'pidor_stats', description: 'Посмотреть статистику пидора дня' },
    { command: 'pidor_stats_year', description: 'Посмотреть статистику пидора дня за текущий год' },
  ]);
})();
