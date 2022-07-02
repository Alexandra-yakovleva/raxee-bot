import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';

import { namedSession } from '../plugins/namedSession';
import { CustomContext } from '../types/context';

export const pokerRootStateMiddleware = () => namedSession<CustomContext, 'pokerRootState'>({
  getSessionKey: () => 'pokerRoot',

  initial: () => ({
    playerIdsByChats: {},
  }),

  name: 'pokerRootState',

  storage: new FileAdapter({
    dirName: path.resolve(__dirname, '../../db'),
  }),
});
