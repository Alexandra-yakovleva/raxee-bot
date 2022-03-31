import { format } from 'date-fns';

export const isFirstApril = () => format(new Date(), 'MM-dd') === '04-01';

export const getCurrentDate = () => {
  if (isFirstApril()) {
    return format(new Date(), 'yyyy-MM-dd-HH');
  }

  return format(new Date(), 'yyyy-MM-dd');
};
