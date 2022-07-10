import { PokerCombination } from '../classes/pokerCombination';

export const subtractPokerCombinations = (left: PokerCombination[], right: PokerCombination[]): PokerCombination[] => {
  return left.filter((a) => {
    const cardsString = a.cards.join('');
    return !right.find((b) => cardsString === b.cards.join(''));
  });
};
