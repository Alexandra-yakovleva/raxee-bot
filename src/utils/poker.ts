/* eslint-disable max-classes-per-file */
export class PokerCard {
  constructor(public suit: number, public value: number) {}

  toString() {
    return [
      ['♠️', '♣️', '♥️', '♦️'][this.suit],
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][this.value],
    ].join('');
  }
}

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

type CardsSubset = [PokerCard, PokerCard, PokerCard, PokerCard, PokerCard];

const getCardsSubsets = (cards: PokerCard[]): CardsSubset[] => {
  const subsets: CardsSubset[] = [];

  for (let i = 0; i < cards.length - 4; i += 1) {
    for (let j = i + 1; j < cards.length - 3; j += 1) {
      for (let k = j + 1; k < cards.length - 2; k += 1) {
        for (let l = k + 1; l < cards.length - 1; l += 1) {
          for (let m = l + 1; m < cards.length; m += 1) {
            subsets.push([cards[i], cards[j], cards[k], cards[l], cards[m]]);
          }
        }
      }
    }
  }

  return subsets;
};

const getHighHand = (cards: PokerCard[]): PokerCombination[] => {
  return cards.map((card) => new PokerCombination(0, [card]));
};

const getOnePair = (cards: PokerCard[]): PokerCombination[] => {
  const combinations: PokerCombination[] = [];

  for (let i = 0; i < cards.length - 1; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      if (cards[i].value === cards[j].value) {
        combinations.push(new PokerCombination(1, [cards[i], cards[j]]));
      }
    }
  }

  return combinations;
};

const getTwoPairs = (onePair: PokerCombination[]): PokerCombination[] => {
  const combinations: PokerCombination[] = [];

  for (let i = 0; i < onePair.length - 1; i += 1) {
    for (let j = i + 1; j < onePair.length; j += 1) {
      const subset = [...onePair[i].cards, ...onePair[j].cards];

      if (subset.filter((item, index, array) => array.indexOf(item) === index).length === 4) {
        combinations.push(new PokerCombination(2, subset));
      }
    }
  }

  return combinations;
};

const getThreeOfAKind = (cards: PokerCard[]): PokerCombination[] => {
  const combinations: PokerCombination[] = [];

  for (let i = 0; i < cards.length - 2; i += 1) {
    for (let j = i + 1; j < cards.length - 1; j += 1) {
      for (let k = j + 1; k < cards.length; k += 1) {
        if (cards[i].value === cards[j].value && cards[i].value === cards[k].value) {
          combinations.push(new PokerCombination(3, [cards[i], cards[j], cards[k]]));
        }
      }
    }
  }

  return combinations;
};

const isStraight = (subset: CardsSubset): boolean => {
  for (let i = 1; i < subset.length; i += 1) {
    const diff = subset[0].value - subset[i].value - i;

    if (diff !== 0 && diff !== -13) {
      return false;
    }
  }

  return true;
};

const getStraight = (cards: PokerCard[]): PokerCombination[] => {
  return getCardsSubsets([...cards, ...cards])
    .filter(isStraight)
    .map((subset) => new PokerCombination(4, subset));
};

const getFlush = (cards: PokerCard[]): PokerCombination[] => {
  return getCardsSubsets(cards)
    .filter((subset) => subset.every((card) => card.suit === subset[0].suit))
    .map((subset) => new PokerCombination(5, subset));
};

const getFullHouse = (onePair: PokerCombination[], threeOfAKind: PokerCombination[]): PokerCombination[] => {
  const combinations: PokerCombination[] = [];

  for (let i = 0; i < threeOfAKind.length; i += 1) {
    for (let j = 0; j < onePair.length; j += 1) {
      if (threeOfAKind[i].cards[0].value !== onePair[j].cards[0].value) {
        combinations.push(new PokerCombination(6, [...threeOfAKind[i].cards, ...onePair[j].cards]));
      }
    }
  }

  return combinations;
};

const getFourOfAKind = (twoPairs: PokerCombination[]): PokerCombination[] => {
  return twoPairs
    .filter((combination) => combination.cards[0].value === combination.cards[2].value)
    .map((combination) => new PokerCombination(7, combination.cards));
};

const getStraightFlush = (straight: PokerCombination[]): PokerCombination[] => {
  return straight
    .filter((combination) => combination.cards.every((card) => card.suit === combination.cards[0].suit))
    .map((combination) => new PokerCombination(8, combination.cards));
};

const getRoyalFlush = (straightFlush: PokerCombination[]): PokerCombination[] => {
  return straightFlush
    .filter((combination) => combination.cards[0].value === 12)
    .map((combination) => new PokerCombination(9, combination.cards));
};

export const getPokerCombinations = (cards: PokerCard[]): PokerCombination[] => {
  cards = [...cards].sort((a, b) => (b.value - a.value) * 100 + (b.suit - a.suit));

  const highHand = getHighHand(cards);
  const onePair = getOnePair(cards);
  const twoPairs = getTwoPairs(onePair);
  const threeOfAKind = getThreeOfAKind(cards);
  const straight = getStraight(cards);
  const flush = getFlush(cards);
  const fullHouse = getFullHouse(onePair, threeOfAKind);
  const fourOfAKind = getFourOfAKind(twoPairs);
  const straightFlush = getStraightFlush(straight);
  const royalFlush = getRoyalFlush(straightFlush);

  return [
    ...royalFlush,
    ...straightFlush,
    ...fourOfAKind,
    ...fullHouse,
    ...flush,
    ...straight,
    ...threeOfAKind,
    ...twoPairs,
    ...onePair,
    ...highHand,
  ];
};

export const subtractPokerCombinations = (left: PokerCombination[], right: PokerCombination[]): PokerCombination[] => {
  return left.filter((a) => {
    const cardsString = a.cards.join('');
    return !right.find((b) => cardsString === b.cards.join(''));
  });
};
