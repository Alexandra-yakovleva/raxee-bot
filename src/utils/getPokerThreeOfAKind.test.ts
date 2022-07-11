import { PokerCard } from '../classes/PokerCard';
import { PokerCombination } from '../classes/PokerCombination';

import { getPokerThreeOfAKind } from './getPokerThreeOfAKind';

test('should return all available triples', () => {
  expect(getPokerThreeOfAKind([
    new PokerCard(3, 9),
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 2),
    new PokerCard(0, 1),
  ])).toStrictEqual([
    new PokerCombination(3, [new PokerCard(3, 2), new PokerCard(2, 2), new PokerCard(1, 2)]),
  ]);

  expect(getPokerThreeOfAKind([
    new PokerCard(3, 9),
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 2),
    new PokerCard(0, 2),
  ])).toStrictEqual([
    new PokerCombination(3, [new PokerCard(3, 2), new PokerCard(2, 2), new PokerCard(1, 2)]),
    new PokerCombination(3, [new PokerCard(3, 2), new PokerCard(2, 2), new PokerCard(0, 2)]),
    new PokerCombination(3, [new PokerCard(3, 2), new PokerCard(1, 2), new PokerCard(0, 2)]),
    new PokerCombination(3, [new PokerCard(2, 2), new PokerCard(1, 2), new PokerCard(0, 2)]),
  ]);
});

test('should return nothing when no triples', () => {
  expect(getPokerThreeOfAKind([
    new PokerCard(3, 9),
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 1),
    new PokerCard(0, 1),
  ])).toStrictEqual([]);

  expect(getPokerThreeOfAKind([
    new PokerCard(3, 9),
    new PokerCard(3, 4),
    new PokerCard(2, 3),
    new PokerCard(1, 2),
    new PokerCard(0, 1),
  ])).toStrictEqual([]);
});
