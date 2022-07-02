import { Context } from 'grammy';

import { PokerFlavour } from '../plugins/poker';
import { ReplyWithMarkdownFlavour } from '../plugins/replyWithMarkdown';

import { PidorState } from './pidor';
import { PokerRootState, PokerState } from './poker';

export type CustomContext =
  Context &
  ReplyWithMarkdownFlavour &
  { pidorState: PidorState } &
  { pokerState: PokerState } &
  { pokerRootState: PokerRootState } &
  PokerFlavour;
