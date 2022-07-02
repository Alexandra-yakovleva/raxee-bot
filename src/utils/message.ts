import { User } from 'grammy/out/platform.node';

import { MessageVariants } from '../types/messages';

import { getRandomItem } from './random';

export const buildMessageVariants = (variants: MessageVariants) => variants;

export const getMessageVariant = (variants: MessageVariants, user?: User) => getRandomItem(variants)(user);

export const escapeMessage = (message: string) => message.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
