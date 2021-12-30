import path from 'path';

import { FileAdapter } from '@satont/grammy-file-storage';
import { MiddlewareFn, session } from 'grammy';

import { ContextWithSession } from '../types/session';

export const getSessionMiddleware = (): MiddlewareFn<ContextWithSession> => session({
  getSessionKey: (ctx) => String(ctx.chat?.id || ctx.from?.id || 0),

  initial: () => ({
    pidor: {
      stats: {},
      users: {},
    },
  }),

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
