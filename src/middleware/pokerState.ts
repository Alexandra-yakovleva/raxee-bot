import path from 'path';

import { FileAdapter } from '@grammyjs/storage-file';

import { namedSession } from '../plugins/namedSession';
import { Poker } from '../plugins/poker';
import { CustomContext } from '../types/context';
import { PokerState } from '../types/poker';
import { PokerCard } from '../utils/poker';

export const pokerStateMiddleware = () => namedSession<CustomContext, 'pokerState'>({
  getSessionKey: (ctx) => (ctx.poker.chatId === undefined ? undefined : `poker ${ctx.poker.chatId}`),
  initial: Poker.generateState,
  name: 'pokerState',

  storage: new FileAdapter<PokerState>({
    deserializer: (input) => {
      const data = JSON.parse(input) as PokerState;

      return {
        ...data,
        cards: data.cards.map((card) => new PokerCard(card.suit, card.value)),
        players: data.players.map((player) => ({
          ...player,
          cards: player.cards.map((card) => new PokerCard(card.suit, card.value)),
        })),
      };
    },

    dirName: path.resolve(__dirname, '../../db'),
  }),
});
