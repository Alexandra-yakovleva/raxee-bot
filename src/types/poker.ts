import { User } from 'grammy/out/platform.node';

import { PokerCard } from '../utils/poker';

export interface PokerPlayer {
  balance: number
  bet: number
  cards: PokerCard[]
  folded: boolean
  lost: boolean
  turnMade: boolean
  user: User
}

export interface PokerState {
  activePlayerIndex: number
  cards: PokerCard[]
  cardsOpened: number
  firstPlayerIndex: number
  players: PokerPlayer[]
  round: number
  started: boolean
}

export interface PokerRootState {
  playerIdsByChats: Record<number, number[]>
}
