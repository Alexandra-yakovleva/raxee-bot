import { PokerCard } from '../classes/PokerCard';
import { PokerState } from '../types/poker';

export const deserializePokerState = (input: string): PokerState => {
  const data = JSON.parse(input) as PokerState;

  return {
    ...data,
    cards: data.cards.map((card) => new PokerCard(card.suit, card.value)),
    players: data.players.map((player) => ({
      ...player,
      cards: player.cards.map((card) => new PokerCard(card.suit, card.value)),
    })),
  };
};
