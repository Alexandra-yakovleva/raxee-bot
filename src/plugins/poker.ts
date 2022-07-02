import { Context, NextFunction } from 'grammy';
import * as R from 'ramda';

import { pokerMessages } from '../constants/messages';
import { pokerStrings } from '../constants/poker';
import { PokerPlayer, PokerRootState, PokerState } from '../types/poker';
import { shuffleItems } from '../utils/random';

import { ReplyWithMarkdownFlavour } from './replyWithMarkdown';

export interface PokerFlavour {
  poker: Poker
}

type PokerContext =
  Context &
  ReplyWithMarkdownFlavour &
  { pokerState: PokerState } &
  { pokerRootState: PokerRootState };

export class Poker {
  static generateState(): PokerState {
    return {
      activePlayerIndex: 0,
      cardsOpened: 0,
      deck: [],
      isAllIn: false,
      isStarted: false,
      players: [],
      round: -1,
    };
  }

  static getCardValue(card: number) {
    return [
      ['♠️', '♣️', '♥️', '♦️'][Math.floor(card / 13)],
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][card % 13],
    ].join('');
  }

  constructor(private ctx: PokerContext) {}

  private get chatIdByUserId() {
    if (!this.ctx.from) {
      return undefined;
    }

    const chatId = Object.entries(this.ctx.pokerRootState.playerIdsByChats).find(([, value]) => value.includes(this.ctx.from!.id))?.[0];

    return chatId === undefined ? undefined : Number(chatId);
  }

  get chatId() {
    if (!this.ctx.chat) {
      return undefined;
    }

    if (this.ctx.chat.type === 'private') {
      return this.chatIdByUserId;
    }

    return this.ctx.chat.id;
  }

  private get activePlayer() {
    return this.ctx.pokerState.players[this.ctx.pokerState.activePlayerIndex];
  }

  private get bankAmount() {
    return this.ctx.pokerState.players.reduce((sum, player) => sum + player.bet, 0);
  }

  private get baseBet() {
    return (Math.floor(this.ctx.pokerState.round / 5) + 1) * 10;
  }

  private get topBet() {
    return Math.max(...this.ctx.pokerState.players.map((player) => player.bet));
  }

  private get firstPlayerIndex() {
    return this.ctx.pokerState.round % this.ctx.pokerState.players.length;
  }

  private getPlayerByUserId(userId: number) {
    return this.ctx.pokerState.players.find((player) => player.user.id === userId);
  }

  private dealCards() {
    this.ctx.pokerState.isStarted = true;
    this.ctx.pokerState.isAllIn = false;
    this.ctx.pokerState.deck = shuffleItems(R.range(0, 52));
    this.ctx.pokerState.round += 1;
    this.ctx.pokerState.cardsOpened = 3;
    this.ctx.pokerState.activePlayerIndex = this.firstPlayerIndex + 1;

    this.ctx.pokerState.players.forEach((player, index) => {
      if (index === this.firstPlayerIndex) {
        player.bet = this.baseBet * 2;
      } else if (index === this.firstPlayerIndex + 1) {
        player.bet = this.baseBet;
      } else {
        player.bet = 0;
      }

      if (player.bet > player.balance) {
        this.ctx.pokerState.isAllIn = true;
        player.bet = player.balance;
        player.balance = 0;
      } else {
        player.balance -= player.bet;
      }

      player.cards = this.ctx.pokerState.deck.splice(0, 2);
    });
  }

  private getKeyboardForPlayer(player: PokerPlayer, isActive: boolean): string[][] {
    const keyboard = [
      [`${this.ctx.pokerState.deck.slice(0, this.ctx.pokerState.cardsOpened).map(Poker.getCardValue).join(' ')}\u3000${this.bankAmount} 🪙`],
      [`${player.cards.map(Poker.getCardValue).join(' ')}\u3000${player.balance} 🪙`],
    ];

    if (isActive) {
      const callAmount = this.topBet - player.bet;

      keyboard.push(
        [
          pokerStrings.fold,
          callAmount < player.balance && (callAmount > 0 ? pokerStrings.call(callAmount) : pokerStrings.check),
          pokerStrings.allIn,
        ].filter(Boolean) as string[],
      );
    }

    return keyboard;
  }

  private async sendMessageToPlayer(player: PokerPlayer, message: string, keyboard?: string[][] | null) {
    await this.ctx.api.sendMessage(
      player.user.id,
      message,
      {
        parse_mode: 'MarkdownV2',
        ...keyboard && { reply_markup: { keyboard } },
        ...keyboard === null && { reply_markup: { remove_keyboard: true } },
      },
    );
  }

  private async setKeyboards() {
    await Promise.all(
      this.ctx.pokerState.players.map(async (player, index) => {
        const isActive = index === this.ctx.pokerState.activePlayerIndex;

        await this.sendMessageToPlayer(
          player,
          isActive ? pokerMessages.onMessage.yourTurn : pokerMessages.onMessage.userTurn(this.activePlayer.user),
          this.getKeyboardForPlayer(player, isActive),
        );
      }),
    );
  }

  async register() {
    if (!this.ctx.chat) {
      throw new Error('ctx.chat is empty');
    }

    if (!this.ctx.from) {
      throw new Error('ctx.from is empty');
    }

    if (this.chatIdByUserId) {
      if (this.chatIdByUserId === this.ctx.chat.id) {
        await this.ctx.replyWithMarkdown(pokerMessages.register.duplicateSameChat, { reply_to_message_id: this.ctx.message?.message_id });
      } else {
        await this.ctx.replyWithMarkdown(pokerMessages.register.duplicateOtherChat, { reply_to_message_id: this.ctx.message?.message_id });
      }

      return;
    }

    if (this.ctx.pokerState.isStarted) {
      await this.ctx.replyWithMarkdown(pokerMessages.register.alreadyStarted, { reply_to_message_id: this.ctx.message?.message_id });
      return;
    }

    if (this.ctx.pokerState.players.length >= 10) {
      await this.ctx.replyWithMarkdown(pokerMessages.register.tooMany, { reply_to_message_id: this.ctx.message?.message_id });
      return;
    }

    this.ctx.pokerRootState.playerIdsByChats[this.ctx.chat.id] = this.ctx.pokerRootState.playerIdsByChats[this.ctx.chat.id] || [];
    this.ctx.pokerRootState.playerIdsByChats[this.ctx.chat.id].push(this.ctx.from.id);

    this.ctx.pokerState.players.push({
      balance: 1000,
      bet: 0,
      cards: [],
      isFold: false,
      user: this.ctx.from,
    });

    await this.ctx.replyWithMarkdown(pokerMessages.register.done, { reply_to_message_id: this.ctx.message?.message_id });
  }

  async start() {
    if (this.ctx.pokerState.isStarted) {
      await this.ctx.replyWithMarkdown(pokerMessages.start.alreadyStarted);
      return;
    }

    if (this.ctx.pokerState.players.length < 2) {
      await this.ctx.replyWithMarkdown(pokerMessages.start.tooFew);
      return;
    }

    this.dealCards();
    await this.setKeyboards();

    await this.ctx.replyWithMarkdown(pokerMessages.start.done);
  }

  private async broadcastMessage() {
    const message = pokerMessages.onMessage.lastAction(this.ctx.from!, this.ctx.message!.text!);

    await Promise.all(this.ctx.pokerState.players.map(async (player) => {
      if (this.ctx.from?.id !== player.user.id) {
        await this.sendMessageToPlayer(player, message);
      }
    }));
  }

  private async nextTurn() {
    this.ctx.pokerState.activePlayerIndex += 1;
    this.ctx.pokerState.activePlayerIndex %= this.ctx.pokerState.players.length;
    await this.broadcastMessage();
    await this.setKeyboards();
  }

  async handleMessage() {
    if (this.ctx.from?.id !== this.activePlayer.user.id) {
      await this.ctx.replyWithMarkdown(pokerMessages.onMessage.wrongTurn);
      await this.broadcastMessage();
    }

    if (this.ctx.from?.id === this.activePlayer.user.id) {
      switch (this.ctx.message?.text) {
        case pokerStrings.fold: {
          this.activePlayer.isFold = true;

          await this.nextTurn();
          break;
        }

        case pokerStrings.check: {
          if (this.topBet - this.activePlayer.bet > 0) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.checkIsNotAllowed);
            break;
          }

          await this.nextTurn();
          break;
        }

        case pokerStrings.allIn: {
          this.ctx.pokerState.isAllIn = true;
          this.activePlayer.bet += this.activePlayer.balance;
          this.activePlayer.balance = 0;

          await this.nextTurn();
          break;
        }

        default: {
          const betAmount = Number(this.ctx.message?.text) || Number(this.ctx.message?.text?.slice(2));

          if (!betAmount) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.unknownCommand);
            await this.broadcastMessage();
            break;
          }

          if (betAmount > this.activePlayer.balance) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.betTooBig);
            break;
          }

          if (betAmount < this.topBet - this.activePlayer.bet) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.betTooSmall);
            break;
          }

          this.activePlayer.bet += betAmount;
          this.activePlayer.balance -= betAmount;

          await this.nextTurn();
        }
      }
    }
  }
}

export const pokerPlugin = () => async (ctx: PokerContext & PokerFlavour, next: NextFunction) => {
  ctx.poker = new Poker(ctx);
  await next();
};
