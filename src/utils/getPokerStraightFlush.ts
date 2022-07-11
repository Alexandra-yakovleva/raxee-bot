import { PokerCombination } from '../classes/PokerCombination';

export const getPokerStraightFlush = (straight: PokerCombination[]): PokerCombination[] => {
  return straight
    .filter((combination) => combination.cards.every((card) => card.suit === combination.cards[0].suit))
    .map((combination) => new PokerCombination(8, combination.cards));
};
