export class PokerCard {
  constructor(public suit: number, public value: number) {}

  toString() {
    return [
      ['♠️', '♣️', '♥️', '♦️'][this.suit],
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][this.value],
    ].join('');
  }
}
