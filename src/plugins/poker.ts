import { Context, NextFunction } from 'grammy';
import * as R from 'ramda';

import { pokerMessages } from '../constants/messages';
import { pokerStrings } from '../constants/poker';
import { PokerPlayer, PokerRootState, PokerState } from '../types/poker';
import { getPokerCombinations, PokerCard, subtractPokerCombinations } from '../utils/poker';
import { shuffleItems } from '../utils/random';
import { getMention } from '../utils/user';

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
      cards: [],
      cardsOpened: 0,
      firstPlayerIndex: -1,
      players: [],
      round: -1,
      started: false,
    };
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

  private get nonLostPlayers() {
    return this.ctx.pokerState.players.filter((player) => !player.lost);
  }

  private get activePlayer() {
    return this.ctx.pokerState.players[this.ctx.pokerState.activePlayerIndex];
  }

  private get firstPlayer() {
    return this.ctx.pokerState.players[this.ctx.pokerState.firstPlayerIndex];
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

  private get isAllIn() {
    return this.ctx.pokerState.players.some((player) => !player.lost && player.balance === 0);
  }

  private getKeyboardForPlayer(player: PokerPlayer, isActive: boolean): string[][] {
    const keyboard: string[][] = [
      this.ctx.pokerState.cards.map((card, index) => (index < this.ctx.pokerState.cardsOpened ? card.toString() : ' ')),
      [`Банк: ${this.bankAmount} 🪙`],
    ];

    if (!player.lost) {
      keyboard.push([...player.cards.map(String), `${player.balance} 🪙`]);
    }

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

  private async sendMessageToPlayer(player: PokerPlayer, message: string, keyboard?: string[][]) {
    await this.ctx.api.sendMessage(
      player.user.id,
      message,
      {
        parse_mode: 'Markdown',
        ...keyboard && { reply_markup: { keyboard } },
      },
    );
  }

  private async broadcastMessage(message: string, players = this.ctx.pokerState.players) {
    await Promise.all(players.map((player) => this.sendMessageToPlayer(player, message)));
  }

  private async broadcastPlayerMessage() {
    await this.broadcastMessage(
      pokerMessages.onMessage.lastAction(this.ctx.from!, this.ctx.message!.text!),
      this.ctx.pokerState.players.filter((player) => player.user.id !== this.ctx.from?.id),
    );
  }

  private async setKeyboards() {
    await Promise.all(
      this.ctx.pokerState.players.map(async (player, index) => {
        const isActive = index === this.ctx.pokerState.activePlayerIndex;

        await this.sendMessageToPlayer(
          player,
          isActive ? pokerMessages.onMessage.yourTurn(this.activePlayer.user) : pokerMessages.onMessage.userTurn(this.activePlayer.user),
          this.getKeyboardForPlayer(player, isActive),
        );
      }),
    );
  }

  private async dealCards() {
    const deck = shuffleItems(R.range(0, 52)).map((fullValue) => new PokerCard(fullValue % 4, Math.floor(fullValue / 4)));

    this.ctx.pokerState.started = true;
    this.ctx.pokerState.round += 1;
    this.ctx.pokerState.cards = deck.splice(0, 5);
    this.ctx.pokerState.cardsOpened = 3;

    do {
      this.ctx.pokerState.firstPlayerIndex += 1;
      this.ctx.pokerState.firstPlayerIndex %= this.ctx.pokerState.players.length;
    } while (this.firstPlayer.lost);

    this.ctx.pokerState.activePlayerIndex = this.ctx.pokerState.firstPlayerIndex;

    do {
      this.ctx.pokerState.activePlayerIndex += 1;
      this.ctx.pokerState.activePlayerIndex %= this.ctx.pokerState.players.length;
    } while (this.activePlayer.lost);

    await this.broadcastMessage([
      '*Играют*',
      ...this.nonLostPlayers.map((player) => `${getMention(player.user)} (${player.balance} 🪙)`),
    ].join('\n'));

    this.ctx.pokerState.players.forEach((player, index) => {
      if (index === this.ctx.pokerState.firstPlayerIndex) {
        player.bet = this.baseBet * 2;
      } else if (index === this.ctx.pokerState.activePlayerIndex) {
        player.bet = this.baseBet;
      } else {
        player.bet = 0;
      }

      player.bet = Math.min(player.bet, player.balance);
      player.balance -= player.bet;
      player.cards = deck.splice(0, 2);
      player.folded = false;
      player.turnMade = false;
    });

    await this.broadcastMessage([
      `Big blind: ${getMention(this.firstPlayer.user)} (${this.firstPlayer.bet} 🪙)`,
      `Small blind: ${getMention(this.activePlayer.user)} (${this.activePlayer.bet} 🪙)`,
    ].join('\n'));

    await this.setKeyboards();
  }

  private async endGame() {
    await this.broadcastMessage(pokerMessages.onMessage.gameOver);

    await Promise.all(this.ctx.pokerState.players.map(async (player) => {
      await this.ctx.api.sendSticker(player.user.id, 'CAACAgIAAxkBAAEVoGViwW3wZ-u-__6McwQN2uWw6nuabAACgAEAAj0N6AS-vFK-9cZHmCkE', { reply_markup: { remove_keyboard: true } });
    }));

    delete this.ctx.pokerRootState.playerIdsByChats[this.chatId!];
    this.ctx.pokerState = Poker.generateState();
  }

  private async finishRound() {
    const messageParts: string[][] = [
      [
        '*Карты*',
        `Стол: ${this.ctx.pokerState.cards.join(' ')}`,
        ...this.nonLostPlayers.map((player) => `${getMention(player.user)}: ${player.cards.join(' ')}`),
      ],
    ];

    const candidates = this.nonLostPlayers.filter((player) => !player.folded);
    const winners: PokerPlayer[] = [];

    if (candidates.length < 2) {
      winners.push(...candidates);
    } else {
      const boardCombinations = getPokerCombinations(this.ctx.pokerState.cards);
      const playersCombinations = candidates.map((player) => subtractPokerCombinations(getPokerCombinations([...this.ctx.pokerState.cards, ...player.cards]), boardCombinations)[0]);
      const topWeight = Math.max(...playersCombinations.map((combination) => combination.weight));

      winners.push(...candidates.filter((_, index) => playersCombinations[index].weight === topWeight));

      messageParts.push([
        '*Комбинации*',
        ...candidates.map((player, index) => `${getMention(player.user)}: ${playersCombinations[index].toString()}`),
      ]);
    }

    if (!winners.length) {
      throw new Error('winners is empty');
    }

    messageParts.push([`Победа: ${winners.map((player) => getMention(player.user)).join(', ')}`]);

    winners.forEach((player) => {
      player.balance += this.bankAmount / winners.length;
    });

    this.ctx.pokerState.players.forEach((player) => {
      if (player.balance === 0) {
        player.lost = true;
      }
    });

    await this.broadcastMessage(messageParts.map((parts) => parts.join('\n')).join('\n\n'));

    if (this.nonLostPlayers.length < 2) {
      await this.endGame();
    } else {
      await this.dealCards();
    }
  }

  private async nextTurn() {
    await this.broadcastPlayerMessage();

    this.activePlayer.turnMade = true;

    if (this.nonLostPlayers.filter((player) => !player.folded).length < 2) {
      await this.finishRound();
      return;
    }

    if (this.ctx.pokerState.players.every((player) => player.folded || player.balance === 0 || (player.turnMade && player.bet === this.topBet))) {
      if (this.ctx.pokerState.cardsOpened === 5 || this.isAllIn) {
        await this.finishRound();
        return;
      }

      this.ctx.pokerState.cardsOpened += 1;
      this.ctx.pokerState.activePlayerIndex = this.ctx.pokerState.firstPlayerIndex;

      this.ctx.pokerState.players.forEach((player) => {
        player.turnMade = false;
      });

      while (this.activePlayer.folded || this.activePlayer.lost) {
        this.ctx.pokerState.activePlayerIndex += 1;
        this.ctx.pokerState.activePlayerIndex %= this.ctx.pokerState.players.length;
      }
    } else {
      do {
        this.ctx.pokerState.activePlayerIndex += 1;
        this.ctx.pokerState.activePlayerIndex %= this.ctx.pokerState.players.length;
      } while (this.activePlayer.folded || this.activePlayer.balance === 0);
    }

    await this.setKeyboards();
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

    if (this.ctx.pokerState.started) {
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
      folded: false,
      lost: false,
      turnMade: false,
      user: this.ctx.from,
    });

    await this.ctx.replyWithMarkdown(pokerMessages.register.done, { reply_to_message_id: this.ctx.message?.message_id });
  }

  async start() {
    if (this.ctx.pokerState.started) {
      await this.ctx.replyWithMarkdown(pokerMessages.start.alreadyStarted);
      return;
    }

    if (this.ctx.pokerState.players.length < 2) {
      await this.ctx.replyWithMarkdown(pokerMessages.start.tooFew);
      return;
    }

    await this.dealCards();
    await this.ctx.replyWithMarkdown(pokerMessages.start.done);
  }

  async stop() {
    if (this.ctx.pokerState.started) {
      await this.endGame();
      await this.ctx.replyWithMarkdown(pokerMessages.stop.done);
    } else {
      await this.endGame();
      await this.ctx.replyWithMarkdown(pokerMessages.stop.notStarted);
    }
  }

  async handleMessage() {
    if (!this.ctx.from) {
      throw new Error('ctx.from is empty');
    }

    if (this.ctx.from.id === this.activePlayer.user.id) {
      const callAmount = this.topBet - this.activePlayer.bet;
      const canCheck = callAmount === 0;
      const canCall = callAmount > 0 && callAmount < this.activePlayer.balance;
      const canAllIn = !this.isAllIn || (!canCheck && !canCall);
      const canRaise = !this.isAllIn;

      switch (this.ctx.message?.text) {
        case pokerStrings.fold: {
          this.activePlayer.folded = true;

          await this.nextTurn();
          break;
        }

        case pokerStrings.check: {
          if (!canCheck) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.checkIsNotAllowed);
            break;
          }

          await this.nextTurn();
          break;
        }

        case pokerStrings.call(callAmount): {
          if (!canCall) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.callIsNotAllowed);
            break;
          }

          this.activePlayer.bet += callAmount;
          this.activePlayer.balance -= callAmount;

          await this.nextTurn();
          break;
        }

        case pokerStrings.allIn: {
          if (!canAllIn) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.allInIsNotAllowed);
            break;
          }

          this.activePlayer.bet += this.activePlayer.balance;
          this.activePlayer.balance = 0;

          await this.nextTurn();
          break;
        }

        default: {
          const betAmount = Number(this.ctx.message?.text);

          if (!betAmount) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.unknownCommand);
            await this.broadcastPlayerMessage();
            break;
          }

          if (!canRaise) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.raiseIsNotAllowed);
            break;
          }

          if (betAmount >= this.activePlayer.balance) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.betTooBig);
            break;
          }

          if (betAmount < callAmount + this.baseBet) {
            await this.ctx.replyWithMarkdown(pokerMessages.onMessage.betTooSmall);
            break;
          }

          this.activePlayer.bet += betAmount;
          this.activePlayer.balance -= betAmount;

          await this.nextTurn();
        }
      }
    } else {
      await this.ctx.replyWithMarkdown(pokerMessages.onMessage.wrongTurn);
      await this.broadcastPlayerMessage();
    }
  }
}

export const pokerPlugin = () => async (ctx: PokerContext & PokerFlavour, next: NextFunction) => {
  ctx.poker = new Poker(ctx);
  await next();
};
