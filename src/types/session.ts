import { Context, SessionFlavor } from 'grammy';

import { PidorState } from './pidor';

export interface SessionData {
  pidor: PidorState
}

export type ContextWithSession = Context & SessionFlavor<SessionData>;
