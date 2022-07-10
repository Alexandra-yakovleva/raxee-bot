import { PokerCard } from '../classes/PokerCard';

export type PokerCardsSubset = [PokerCard, PokerCard, PokerCard, PokerCard, PokerCard];

export interface PokerRootState {
  playerIdsByChats: Record<number, number[]>
}
