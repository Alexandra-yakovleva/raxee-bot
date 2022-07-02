import { Context } from 'grammy';

import { ReplyWithMarkdownFlavour } from '../plugins/replyWithMarkdown';

import { PidorState } from './pidor';

export type CustomContext =
  Context &
  ReplyWithMarkdownFlavour &
  { pidorState: PidorState };
