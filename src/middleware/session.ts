import path from 'path';

import { FileAdapter } from '@satont/grammy-file-storage';
import { MiddlewareFn, session } from 'grammy';

import { CustomContext } from '../types/context';

export const getSessionMiddleware = (): MiddlewareFn<CustomContext> => session({
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
