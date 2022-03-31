import { Context } from 'grammy';
import { User } from 'grammy/out/platform.node';

import { MessageStatsVariant, MessageVariants } from '../types/messages';

import { isFirstApril } from './date';
import { getRandomItem } from './random';

export const buildMessageVariants = (variants: MessageVariants) => variants;
export const buildMessageStatsVariant = (statsVariant: MessageStatsVariant) => statsVariant;

export const getMessageVariant = (variants: MessageVariants, user?: User) => getRandomItem(variants)(user);

export const sendMessage = async (ctx: Context, text: string, reply_to_message_id?: number) => {
  if (isFirstApril()) {
    // eslint-disable-next-line no-param-reassign
    text = text.replace(/дня/g, 'часа');
  }

  await ctx.reply(
    text,
    {
      parse_mode: 'Markdown',
      reply_to_message_id,
    },
  );
};
