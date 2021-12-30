import { User } from 'grammy/out/platform.node';

export type MessageVariants = Array<(user?: User) => string>;

export interface MessageStatsVariant {
  row: (index: number, user: User, count: number) => string,
  title: () => string,
  total: (count: number) => string,
}
