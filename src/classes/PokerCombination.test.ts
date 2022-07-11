import { PokerCard } from './PokerCard';
import { PokerCombination } from './pokerCombination';

describe('#constructor', () => {
  test('should properly save level and cards', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7)];
    const combination = new PokerCombination(1, cards);
    expect(combination.level).toBe(1);
    expect(combination.cards).toBe(cards);
  });
});

describe('#firstCard', () => {
  test('should return first card', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7)];
    const combination = new PokerCombination(1, cards);
    expect(combination.firstCard).toBe(cards[0]);
  });
});

describe('#secondCard', () => {
  test('should return third card when level is 2', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4), new PokerCard(3, 5)];
    const combination = new PokerCombination(2, cards);
    expect(combination.secondCard).toBe(cards[2]);
  });

  test('should return fourth card when level is 6', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4), new PokerCard(3, 5), new PokerCard(1, 3)];
    const combination = new PokerCombination(6, cards);
    expect(combination.secondCard).toBe(cards[3]);
  });

  test('should return null when any other level', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4)];
    const combination = new PokerCombination(3, cards);
    expect(combination.secondCard).toBe(null);
  });
});

describe('#weight', () => {
  test('should return weight', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4)];
    const combination = new PokerCombination(3, cards);
    expect(combination.weight).toBe(30300);
  });

  test('should return weight when secondCard is presented', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4), new PokerCard(3, 5)];
    const combination = new PokerCombination(2, cards);
    expect(combination.weight).toBe(20304);
  });
});

describe('#levelName', () => {
  test('should return level name', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4)];
    const combination = new PokerCombination(3, cards);
    expect(combination.levelName).toBe('тройка');
  });
});

describe('#toString', () => {
  test('should return text value', () => {
    const cards = [new PokerCard(1, 3), new PokerCard(0, 7), new PokerCard(3, 4), new PokerCard(3, 5)];
    const combination = new PokerCombination(2, cards);
    expect(combination.toString()).toBe('♣️5 ♠️9 ♦️6 ♦️7 (две пары)');
  });
});
