import { User } from 'grammy/out/platform.node';

export const getUserName = (user?: User) => {
  return user ? user.username || [user.first_name, user.last_name].filter(Boolean).join(' ') : '';
};
