import { PokerCombination } from '../classes/PokerCombination';

export const getPokerRoyalFlush = (straightFlush: PokerCombination[]): PokerCombination[] => {
  return straightFlush
    .filter((combination) => combination.cards[0].value === 12)
    .map((combination) => new PokerCombination(9, combination.cards));
};
