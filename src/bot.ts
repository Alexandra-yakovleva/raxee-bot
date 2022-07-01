import { Bot } from 'grammy';

import { getSessionMiddleware } from './middleware/session';
import { getPidorModule } from './modules/pidor';
import { replyWithMarkdown } from './plugins/replyWithMarkdown';
import { CustomContext } from './types/context';

require('dotenv-flow').config();

(async () => {
  const bot = new Bot<CustomContext>(process.env.BOT_TOKEN!);
  bot.use(replyWithMarkdown());
  bot.use(getSessionMiddleware());
  bot.use(getPidorModule());

  bot.start();

  await bot.api.setMyCommands([
    { command: 'pidor', description: 'Определить пидора дня' },
    { command: 'pidor_reg', description: 'Стать участником пидора дня' },
    { command: 'pidor_stats', description: 'Посмотреть статистику пидора дня' },
    { command: 'pidor_stats_year', description: 'Посмотреть статистику пидора дня за текущий год' },
  ]);
})();
