import { Bot } from 'grammy';

import { pidorMiddleware } from './middleware/pidorState';
import { pokerRootStateMiddleware } from './middleware/pokerRootState';
import { pokerStateMiddleware } from './middleware/pokerState';
import { pidorModule } from './modules/pidor';
import { pokerModule } from './modules/poker';
import { voiceModule } from './modules/voice';
import { replyWithMarkdownPlugin } from './plugins/replyWithMarkdown';
import { CustomContext } from './types/context';
import { handleError } from './utils';

require('dotenv-flow').config();

(async () => {
  const bot = new Bot<CustomContext>(process.env.BOT_TOKEN!);
  bot.use(
    replyWithMarkdownPlugin(),
    pidorMiddleware(),
    pokerRootStateMiddleware(),
    pokerStateMiddleware(),
    pidorModule(),
    pokerModule(),
    voiceModule(),
  );
  bot.catch(handleError);
  bot.start();

  await bot.api.setMyCommands([
    { command: 'pidor', description: 'Определить пидора дня' },
    { command: 'pidor_reg', description: 'Стать участником пидора дня' },
    { command: 'pidor_stats', description: 'Посмотреть статистику пидора дня' },
    { command: 'pidor_stats_year', description: 'Посмотреть статистику пидора дня за текущий год' },
    { command: 'poker_reg', description: 'Присоединиться к игре в покер' },
    { command: 'poker_start', description: 'Начать игру в покер' },
    { command: 'poker_stop', description: 'Закончить игру в покер' },
  ]);
})();
