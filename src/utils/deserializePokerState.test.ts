import { PokerCard } from '../classes/PokerCard';
import { PokerState } from '../types/poker';

import { deserializePokerState } from './deserializePokerState';

test('should deserialize cards', () => {
  const state: PokerState = {
    activePlayerIndex: 1,
    cards: [new PokerCard(3, 4), new PokerCard(0, 5)],
    cardsOpened: 3,
    firstPlayerIndex: 0,
    players: [
      {
        balance: 780,
        bet: 20,
        cards: [new PokerCard(1, 6), new PokerCard(2, 7)],
        folded: false,
        lost: false,
        turnMade: false,
        user: { first_name: 'first', id: 12345, is_bot: false },
      },
      {
        balance: 1160,
        bet: 40,
        cards: [new PokerCard(3, 8), new PokerCard(0, 9)],
        folded: false,
        lost: false,
        turnMade: false,
        user: { first_name: 'second', id: 54321, is_bot: false },
      },
    ],
    round: 2,
    started: true,
  };

  expect(deserializePokerState(JSON.stringify(state))).toStrictEqual(state);
});
