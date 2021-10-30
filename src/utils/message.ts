import {Context} from 'telegraf'
import {getRandomItem} from './random'
import {MessageVariants} from '../types/messages'
import {User} from 'typegram'

export const buildMessageVariants = (variants: MessageVariants) => variants

export const getMessageVariant = (variants: MessageVariants, user: User) => {
  return getRandomItem(variants)(user)
}

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
