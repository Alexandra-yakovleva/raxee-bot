import {Context} from 'telegraf'

export const sendMessage = (ctx: Context, text: string, reply_to_message_id?: number) => {
  ctx.telegram.sendMessage(
    ctx.message?.chat.id!,
    text,
    {
      parse_mode: 'Markdown',
      reply_to_message_id,
    },
  )
}
