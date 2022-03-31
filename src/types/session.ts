import { Context, SessionFlavor } from 'grammy';
import { User } from 'grammy/out/platform.node';

export type Pidor = {
  stats: Record<string, number>
  users: Record<number, User>
};

export type SessionData = {
  pidor: Pidor
};

export type ContextWithSession = Context & SessionFlavor<SessionData>;
