import { User } from 'grammy/out/platform.node';
import * as R from 'remeda';

import { pokerMessages, pokerStrings } from '../constants/poker';
import { CustomContext } from '../types/context';
import { differenceWith, getPokerCombinations } from '../utils';

import { PokerCard, PokerCardRaw } from './PokerCard';

export interface PokerPlayerRaw {
  balance: number;
  bet: number;
  cards: PokerCardRaw[];
  folded: boolean;
  lost: boolean;
  turnMade: boolean;
  user: User;
}

export class PokerPlayer {
  balance = 1000;

  bet = 0;

  cards: PokerCard[] = [];

  folded = false;

  lost = false;

  turnMade = false;

  constructor(public ctx: CustomContext, public user: User) {}

  static fromRaw(ctx: CustomContext, raw: PokerPlayerRaw) {
    const instance = new PokerPlayer(ctx, raw.user);
    instance.balance = raw.balance;
    instance.bet = raw.bet;
    instance.cards = raw.cards.map((rawCard) => PokerCard.fromRaw(rawCard));
    instance.folded = raw.folded;
    instance.lost = raw.lost;
    instance.turnMade = raw.turnMade;
    return instance;
  }

  toRaw(): PokerPlayerRaw {
    return {
      balance: this.balance,
      bet: this.bet,
      cards: this.cards.map((card) => card.toRaw()),
      folded: this.folded,
      lost: this.lost,
      turnMade: this.turnMade,
      user: this.user,
    };
  }

  get combinations() {
    return getPokerCombinations([...this.ctx.pokerState.cards, ...this.cards]);
  }

  get ownCombinations() {
    return differenceWith(this.combinations, this.ctx.pokerState.boardCombinations, R.equals);
  }

  get topCombination() {
    return this.ownCombinations[0];
  }

  get win() {
    return !this.folded && this.topCombination.weight === this.ctx.pokerState.topWeight;
  }

  get callAmount() {
    return this.ctx.pokerState.topBet - this.bet;
  }

  get canFold() {
    return !(this.ctx.pokerState.isAllIn && this.balance === 0);
  }

  get canCheck() {
    return this.callAmount === 0;
  }

  get canCall() {
    return this.callAmount > 0 && this.callAmount < this.balance;
  }

  get canAllIn() {
    return !this.ctx.pokerState.isAllIn || (!this.canCheck && !this.canCall);
  }

  get canRaise() {
    return !this.ctx.pokerState.isAllIn;
  }

  get keyboard(): string[][] {
    const keyboard: string[][] = [
      this.ctx.pokerState.cards.map((card, index) => (index < this.ctx.pokerState.cardsOpened ? card.toString() : ' ')),
      [`Банк: ${this.ctx.pokerState.bankAmount} 🪙`],
    ];

    if (!this.lost) {
      keyboard.push([...this.cards.map(String), `${this.balance} 🪙`]);
    }

    if (this === this.ctx.pokerState.activePlayer) {
      keyboard.push(
        [
          this.canFold && pokerStrings.fold,
          this.canCheck && pokerStrings.check,
          this.canCall && pokerStrings.call(this.callAmount),
          this.canAllIn && pokerStrings.allIn,
        ].filter(Boolean) as string[],
      );
    }

    return keyboard;
  }

  async sendMessage(message: string, withKeyboard = false) {
    await this.ctx.api.sendMessage(
      this.user.id,
      message,
      {
        parse_mode: 'Markdown',
        ...withKeyboard && { reply_markup: { keyboard: this.keyboard } },
      },
    );
  }

  async setKeyboard() {
    await this.sendMessage(
      this === this.ctx.pokerState.activePlayer
        ? pokerMessages._.yourTurn(this.ctx.pokerState.activePlayer)
        : pokerMessages._.userTurn(this.ctx.pokerState.activePlayer),
      true,
    );
  }

  async increaseBet(amount: number) {
    amount = Math.min(amount, this.balance);

    this.bet += amount;
    this.balance -= amount;
  }
}
