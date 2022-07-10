// eslint-disable-next-line no-restricted-imports
import { purry } from 'remeda';

export function startsWith(str: string, search: string): boolean;
export function startsWith(search: string): (str: string) => boolean;

export function startsWith() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, prefer-rest-params
  return purry(_startsWith, arguments);
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _startsWith = (str: string, search: string) => str.startsWith(search);
