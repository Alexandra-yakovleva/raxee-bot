import { User } from 'grammy/out/platform.node';

import { getMention } from '../../utils/user';

export const pokerMessages = {
  onMessage: {
    allInIsNotAllowed: 'Ты не можешь сделать all-in',
    betTooBig: 'У тебя нет столько денег',
    betTooSmall: 'Ставка слишком маленькая',
    callIsNotAllowed: 'Ты не можешь сделать call',
    checkIsNotAllowed: 'Ты не можешь сделать check',
    foldIsNotAllowed: 'Ты не можешь сделать fold',
    gameOver: 'Игра окончена, всем спасибо',
    lastAction: (user: User, message: string) => `${getMention(user)}: ${message}`,
    raiseIsNotAllowed: 'Ты не можешь сделать raise',
    unknownCommand: 'Я тебя не понял, но всем передал',
    userTurn: (user: User) => `Ходит ${getMention(user)}`,
    wrongTurn: 'Сейчас не твой ход, но я всем передал',
    yourTurn: (user: User) => `Твой ход, ${getMention(user)}`,
  },

  register: {
    alreadyStarted: 'Игра в этом чате уже началась',
    done: 'Готовься, ты в игре. Чтобы я смог с тобой общаться, [начни чат со мной](https://t.me/raxee_bot)',
    duplicateOtherChat: 'Ты уже в игре в другом чате',
    duplicateSameChat: 'Ты уже в игре в этом чате',
    tooMany: 'Слишком много игроков в этом чате',
  },

  start: {
    alreadyStarted: 'Игра уже началась',
    done: 'Го в [ЛС](https://t.me/raxee_bot), игра началась',
    tooFew: 'Слишком мало игроков, добавляйтесь через /poker\\_reg',
  },

  stop: {
    done: 'Игра в этом чате остановлена',
    notStarted: 'Игра в этом чате не была запущена, но я удалил, всех кто присоединился',
  },
};
