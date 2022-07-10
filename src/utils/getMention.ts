import { User } from 'grammy/out/platform.node';

import { getUserName } from './getUserName';

export const getMention = (user?: User) => {
  return user?.username ? `@${user.username}` : `[${getUserName(user)}](tg://user?id=${user?.id})`;
};
