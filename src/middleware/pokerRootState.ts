import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';

import { PokerRootState } from '../classes/PokerRootState';
import { namedSession } from '../plugins/namedSession';
import { CustomContext } from '../types/context';

export const pokerRootStateMiddleware = () => namedSession<CustomContext, 'pokerRootState'>({
  getSessionKey: () => 'poker_root',

  getStorage: (ctx) => new FileAdapter({
    deserializer: (input) => PokerRootState.fromRaw(ctx, JSON.parse(input)),
    dirName: path.resolve(__dirname, '../../db'),
    serializer: (input) => JSON.stringify(input.toRaw()),
  }),

  initial: (ctx) => new PokerRootState(ctx),
  name: 'pokerRootState',
});
