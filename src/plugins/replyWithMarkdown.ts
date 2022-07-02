import { Context, NextFunction } from 'grammy';

export interface ReplyWithMarkdownFlavour {
  replyWithMarkdown: Context['reply']
}

export const replyWithMarkdown = () => (ctx: Context & ReplyWithMarkdownFlavour, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  ctx.replyWithMarkdown = function replyWithMarkdown(this: typeof ctx, ...args: Parameters<Context['reply']>) {
    return this.reply(args[0], { parse_mode: 'MarkdownV2', ...args[1] }, args[2]);
  };

  next();
};
