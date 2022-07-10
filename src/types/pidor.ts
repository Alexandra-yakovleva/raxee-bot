import { User } from 'grammy/out/platform.node';

export interface PidorStatsMessageVariant {
  row: (index: number, user: User, count: number) => string,
  title: () => string,
  total: (count: number) => string,
}

export interface PidorState {
  stats: Record<string, number>
  users: Record<number, User>
}
