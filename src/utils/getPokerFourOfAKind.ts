import { PokerCombination } from '../classes/PokerCombination';

export const getPokerFourOfAKind = (twoPairs: PokerCombination[]): PokerCombination[] => {
  return twoPairs
    .filter((combination) => combination.cards[0].value === combination.cards[2].value)
    .map((combination) => new PokerCombination(7, combination.cards));
};
