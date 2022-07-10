import { PokerCard } from './PokerCard';

export class PokerCombination {
  constructor(public level: number, public cards: PokerCard[]) {}

  get firstCard() {
    return this.cards[0];
  }

  get secondCard() {
    if (this.level === 2) return this.cards[2];
    if (this.level === 6) return this.cards[3];
    return null;
  }

  get weight() {
    return this.level * 10000 + this.firstCard.value * 100 + (this.secondCard?.value || 0);
  }

  get levelName() {
    return ['старшая карта', 'пара', 'две пары', 'тройка', 'стрит', 'флэш', 'фулл-хауз', 'каре', 'стрит флэш', 'флэш рояль'][this.level];
  }

  toString() {
    return [
      this.cards.join(' '),
      `(${this.levelName})`,
    ].join(' ');
  }
}
