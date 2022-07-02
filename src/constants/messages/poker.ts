import { User } from 'grammy/out/platform.node';

import { escapeMessage } from '../../utils/message';
import { getMention } from '../../utils/user';

export const pokerMessages = {
  onMessage: {
    betTooBig: 'У тебя нет столько денег',
    betTooSmall: 'Ставка слишком маленькая',
    checkIsNotAllowed: 'Ты не можешь сделать check',
    lastAction: (user: User, message: string) => `${getMention(user)}: ${escapeMessage(message)}`,
    unknownCommand: 'Я тебя не понял, но всем передал',
    userTurn: (user: User) => `Ходит ${getMention(user)}`,
    wrongTurn: 'Сейчас не твой ход, но я всем передал',
    yourTurn: 'Твой ход',
  },

  register: {
    alreadyStarted: 'Игра в этом чате уже началась',
    done: 'Готовься, ты в игре',
    duplicateOtherChat: 'Ты уже в игре в другом чате',
    duplicateSameChat: 'Ты уже в игре в этом чате',
    tooMany: 'Слишком много игроков в этом чате',
  },

  start: {
    alreadyStarted: 'Игра уже началась',
    done: 'Го в ЛС, игра началась',
    tooFew: 'Слишком мало игроков, добавляйтесь через /poker\\_reg',
  },
};
