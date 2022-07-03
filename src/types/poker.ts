import { User } from 'grammy/out/platform.node';

import { PokerCard } from '../utils/poker';

export interface PokerPlayer {
  balance: number
  bet: number
  cards: PokerCard[]
  isFold: boolean
  user: User
}

export interface PokerState {
  activePlayerIndex: number,
  cards: PokerCard[]
  cardsOpened: number
  isStarted: boolean
  players: PokerPlayer[]
  round: number,
}

export interface PokerRootState {
  playerIdsByChats: Record<number, number[]>
}
