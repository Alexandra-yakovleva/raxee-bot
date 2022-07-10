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

  toString() {
    return [
      ['Старшая карта', 'Пара', 'Две пары', 'Тройка', 'Стрит', 'Флэш', 'Фулл-хауз', 'Каре', 'Стрит флэш', 'Флэш рояль'][this.level],
      `(${this.cards.join(' ')})`,
    ].join(' ');
  }
}
