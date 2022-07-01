import { Context, NextFunction } from 'grammy';

export interface ReplyWithMarkdown {
  replyWithMarkdown: Context['reply']
}

export const replyWithMarkdown = () => (ctx: Context & ReplyWithMarkdown, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  ctx.replyWithMarkdown = function replyWithMarkdown(this: typeof ctx, ...args: Parameters<Context['reply']>) {
    return this.reply(args[0], { parse_mode: 'Markdown', ...args[1] }, args[2]);
  };

  next();
};
