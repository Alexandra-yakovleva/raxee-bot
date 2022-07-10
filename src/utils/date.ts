import { format } from 'date-fns';

export const isFirstApril = () => ['04-01'].includes(format(new Date(), 'MM-dd'));
export const isHalloween = () => ['10-25', '10-26', '10-27', '10-28', '10-29', '10-30', '10-31'].includes(format(new Date(), 'MM-dd'));
