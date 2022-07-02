import { Composer } from 'grammy';

import { CustomContext } from '../types/context';

export const pokerModule = () => {
  const bot = new Composer<CustomContext>();

  bot.command('poker', async (ctx) => {
    await ctx.poker.start();
  });

  bot.command('poker_reg', async (ctx) => {
    await ctx.poker.register();
  });

  bot.on('message:text', async (ctx, next) => {
    if (ctx.poker.chatId !== undefined) {
      await ctx.poker.handleMessage();
    }

    await next();
  });

  return bot;
};
