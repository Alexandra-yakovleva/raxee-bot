import {Context} from 'telegraf'

export const sendMessage = (ctx: Context, text: string) => {
  ctx.telegram.sendMessage(
    ctx.message?.chat.id!,
    text,
    {parse_mode: 'Markdown'},
  )
}
