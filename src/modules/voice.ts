import { Composer } from 'grammy';

import { CustomContext } from '../types/context';

export const voiceModule = () => {
  const bot = new Composer<CustomContext>();

  bot.on('message:voice', async (ctx, next) => {
    if (Math.random() < 0.5) {
      await ctx.replyWithSticker('CAACAgIAAxkBAAEV1F1iyfQL8tS-lOMH8CFUKbo7oWispgACBQgAAhUp-UqUfZ4xg7K-CSkE');
    }

    await next();
  });

  return bot;
};
