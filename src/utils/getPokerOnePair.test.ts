import { PokerCard } from '../classes/PokerCard';
import { PokerCombination } from '../classes/PokerCombination';

import { getPokerOnePair } from './getPokerOnePair';

test('should return all available pairs', () => {
  expect(getPokerOnePair([
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 1),
    new PokerCard(0, 1),
  ])).toStrictEqual([
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(2, 2)]),
    new PokerCombination(1, [new PokerCard(1, 1), new PokerCard(0, 1)]),
  ]);

  expect(getPokerOnePair([
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 2),
    new PokerCard(0, 1),
  ])).toStrictEqual([
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(2, 2)]),
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(1, 2)]),
    new PokerCombination(1, [new PokerCard(2, 2), new PokerCard(1, 2)]),
  ]);

  expect(getPokerOnePair([
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 2),
    new PokerCard(0, 2),
  ])).toStrictEqual([
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(2, 2)]),
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(1, 2)]),
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(0, 2)]),
    new PokerCombination(1, [new PokerCard(2, 2), new PokerCard(1, 2)]),
    new PokerCombination(1, [new PokerCard(2, 2), new PokerCard(0, 2)]),
    new PokerCombination(1, [new PokerCard(1, 2), new PokerCard(0, 2)]),
  ]);

  expect(getPokerOnePair([
    new PokerCard(3, 2),
    new PokerCard(2, 2),
    new PokerCard(1, 3),
    new PokerCard(0, 1),
  ])).toStrictEqual([
    new PokerCombination(1, [new PokerCard(3, 2), new PokerCard(2, 2)]),
  ]);
});

test('should return nothing when no pairs', () => {
  expect(getPokerOnePair([
    new PokerCard(3, 4),
    new PokerCard(2, 3),
    new PokerCard(1, 2),
    new PokerCard(0, 1),
  ])).toStrictEqual([]);
});
