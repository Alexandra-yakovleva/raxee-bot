import { User } from 'grammy/out/platform.node';

export interface PokerLastAction {
  message: string
  user: User
}

export interface PokerPlayer {
  balance: number
  bet: number
  cards: number[]
  user: User
}

export interface PokerState {
  activePlayerIndex: number,
  cardsOpened: number
  deck: number[]
  isAllIn: boolean
  isStarted: boolean
  players: PokerPlayer[]
  round: number,
}

export interface PokerRootState {
  playerIdsByChats: Record<number, number[]>
}
