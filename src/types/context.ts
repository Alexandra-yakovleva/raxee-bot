import { Context } from 'grammy';

import { PokerRootState } from '../classes/PokerRootState';
import { PokerState } from '../classes/PokerState';
import { ReplyWithMarkdownFlavour } from '../plugins/replyWithMarkdown';

import { PidorState } from './pidor';

export type CustomContext =
  Context &
  ReplyWithMarkdownFlavour &
  { pidorState: PidorState } &
  { pokerState: PokerState } &
  { pokerRootState: PokerRootState };
