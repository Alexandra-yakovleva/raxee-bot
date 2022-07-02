import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';

import { namedSession } from '../plugins/namedSession';
import { Poker } from '../plugins/poker';
import { CustomContext } from '../types/context';

export const pokerStateMiddleware = () => namedSession<CustomContext, 'pokerState'>({
  getSessionKey: (ctx) => (ctx.poker.chatId === undefined ? undefined : `poker ${ctx.poker.chatId}`),
  initial: Poker.generateState,
  name: 'pokerState',

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
