import { PokerCard } from '../classes/PokerCard';
import { PokerCombination } from '../classes/pokerCombination';

export const getPokerHighHand = (cards: PokerCard[]): PokerCombination[] => {
  return cards.map((card) => new PokerCombination(0, [card]));
};
