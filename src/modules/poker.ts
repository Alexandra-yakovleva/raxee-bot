import { Composer } from 'grammy';

import { CustomContext } from '../types/context';

export const pokerModule = () => {
  const bot = new Composer<CustomContext>();

  bot.chatType(['group', 'supergroup']).command('poker_reg', async (ctx) => {
    await ctx.poker.register();
  });

  bot.chatType(['group', 'supergroup']).command('poker_start', async (ctx) => {
    await ctx.poker.start();
  });

  bot.chatType(['group', 'supergroup']).command('poker_stop', async (ctx) => {
    await ctx.poker.stop();
  });

  bot.chatType('private').on('message:text', async (ctx, next) => {
    if (ctx.poker.chatId !== undefined) {
      await ctx.poker.handleMessage();
    }

    await next();
  });

  return bot;
};
