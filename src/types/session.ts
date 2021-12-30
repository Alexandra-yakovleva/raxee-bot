import { User } from 'grammy/out/platform.node';
import { Context, SessionFlavor } from 'grammy';

export type Pidor = {
  stats: Record<string, number>
  users: Record<number, User>
};

export type SessionData = {
  pidor: Pidor
};

export type ContextWithSession = Context & SessionFlavor<SessionData>;
