import {User} from 'typegram'

export const getUserName = (user: User) => {
  return user.username || [user.first_name, user.last_name].filter(Boolean).join(' ')
}

export const getMention = (user: User) => {
  return user.username ? `@${user.username}` : `[${getUserName(user)}](tg://user?id=${user.id})`
}
