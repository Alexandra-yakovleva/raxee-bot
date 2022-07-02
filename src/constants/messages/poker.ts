import { User } from 'grammy/out/platform.node';

import { PokerLastAction } from '../../types/poker';
import { escapeMessage } from '../../utils/message';
import { getMention } from '../../utils/user';

export const pokerMessages = {
  _: {
    lastAction: (lastAction: PokerLastAction) => `${getMention(lastAction.user)}: ${escapeMessage(lastAction.message)}`,
    userTurn: (user: User) => `Ходит ${getMention(user)}`,
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
