import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';
import { MiddlewareFn } from 'grammy';

import { namedSession } from '../plugins/namedSession';
import { CustomContext } from '../types/context';

export const getPidorMiddleware = (): MiddlewareFn<CustomContext> => namedSession('pidor', {
  getSessionKey: (ctx) => `pidor ${ctx.chat?.id}`,

  initial: () => ({
    stats: {},
    users: {},
  }),

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
