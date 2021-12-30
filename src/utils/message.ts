import { User } from 'grammy/out/platform.node';
import { Context } from 'grammy';

import { MessageStatsVariant, MessageVariants } from '../types/messages';

import { getRandomItem } from './random';

export const buildMessageVariants = (variants: MessageVariants) => variants;
export const buildMessageStatsVariant = (statsVariant: MessageStatsVariant) => statsVariant;

export const getMessageVariant = (variants: MessageVariants, user?: User) => getRandomItem(variants)(user);

export const sendMessage = (ctx: Context, text: string, reply_to_message_id?: number) => {
  ctx.reply(
    text,
    {
      parse_mode: 'Markdown',
      reply_to_message_id,
    },
  );
};
