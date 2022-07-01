import { Context, SessionFlavor } from 'grammy';

import { ReplyWithMarkdown } from '../plugins/replyWithMarkdown';

import { SessionData } from './session';

export type CustomContext = Context & ReplyWithMarkdown & SessionFlavor<SessionData>;
