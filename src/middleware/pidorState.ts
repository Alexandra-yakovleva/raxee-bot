import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';

import { namedSession } from '../plugins/namedSession';
import { CustomContext } from '../types/context';

export const pidorMiddleware = () => namedSession<CustomContext, 'pidorState'>({
  getSessionKey: (ctx) => (ctx.chat?.id === undefined ? undefined : `pidor_${ctx.chat.id}`),

  initial: () => ({
    stats: {},
    users: {},
  }),

  name: 'pidorState',

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
