import { Composer } from 'grammy';

import { PokerPlayer } from '../classes/PokerPlayer';
import { pokerMessages } from '../constants/poker';
import { CustomContext } from '../types/context';

export const pokerModule = () => {
  const bot = new Composer<CustomContext>();

  bot.chatType(['group', 'supergroup']).command('poker_reg', async (ctx) => {
    if (!ctx.from) {
      throw new Error('ctx.from is empty');
    }

    if (ctx.pokerRootState.lobbyByUser) {
      if (ctx.pokerRootState.lobbyByUser === ctx.pokerRootState.lobbyByGroup) {
        await ctx.replyWithMarkdown(pokerMessages.register.duplicateSameChat, { reply_to_message_id: ctx.message?.message_id });
      } else {
        await ctx.replyWithMarkdown(pokerMessages.register.duplicateOtherChat, { reply_to_message_id: ctx.message?.message_id });
      }

      return;
    }

    if (ctx.pokerState.started) {
      await ctx.replyWithMarkdown(pokerMessages.register.alreadyStarted, { reply_to_message_id: ctx.message?.message_id });
      return;
    }

    if (ctx.pokerState.players.length >= 10) {
      await ctx.replyWithMarkdown(pokerMessages.register.tooMany, { reply_to_message_id: ctx.message?.message_id });
      return;
    }

    ctx.pokerRootState.addUserToLobby();
    ctx.pokerState.players.push(new PokerPlayer(ctx, ctx.from));

    await ctx.replyWithMarkdown(pokerMessages.register.done, { reply_to_message_id: ctx.message?.message_id });
  });

  bot.chatType(['group', 'supergroup']).command('poker_start', async (ctx) => {
    if (ctx.pokerState.started) {
      await ctx.replyWithMarkdown(pokerMessages.start.alreadyStarted);
      return;
    }

    if (ctx.pokerState.players.length < 2) {
      await ctx.replyWithMarkdown(pokerMessages.start.tooFew);
      return;
    }

    await ctx.pokerState.dealCards();
    await ctx.replyWithMarkdown(pokerMessages.start.done);
  });

  bot.chatType(['group', 'supergroup']).command('poker_stop', async (ctx) => {
    if (ctx.pokerState.started) {
      await ctx.pokerState.finishGame();
      await ctx.replyWithMarkdown(pokerMessages.stop.done);
    } else {
      await ctx.pokerState.finishGame();
      await ctx.replyWithMarkdown(pokerMessages.stop.notStarted);
    }
  });

  bot.chatType('private').on('message:text', async (ctx, next) => {
    if (!ctx.from) {
      throw new Error('ctx.from is empty');
    }

    const player = ctx.pokerState.getPlayerByUserId(ctx.from.id);

    if (!player) {
      throw new Error('player not found');
    }

    const message = ctx.message?.text || '';

    if (ctx.from.id === ctx.pokerState.activePlayer.user.id) {
      const reply = await ctx.pokerState.handleMessage(player, message);

      if (reply) {
        await ctx.replyWithMarkdown(reply);
      }
    } else {
      await ctx.replyWithMarkdown(pokerMessages.onMessage.wrongTurn);
      await ctx.pokerState.broadcastPlayerMessage(player, message);
    }

    await next();
  });

  return bot;
};
