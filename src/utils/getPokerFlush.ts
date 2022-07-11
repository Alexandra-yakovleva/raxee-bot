import { PokerCard } from '../classes/PokerCard';
import { PokerCombination } from '../classes/PokerCombination';

import { getPokerCardsSubsets } from './getPokerCardsSubsets';

export const getPokerFlush = (cards: PokerCard[]): PokerCombination[] => {
  return getPokerCardsSubsets(cards)
    .filter((subset) => subset.every((card) => card.suit === subset[0].suit))
    .map((subset) => new PokerCombination(5, subset));
};
