// eslint-disable-next-line no-restricted-imports
import { purry } from 'remeda';

export function startsWith(str: string, searchString: string, position?: number): boolean;
export function startsWith(str: string, position?: number): (searchString: string) => boolean;

export function startsWith() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, prefer-rest-params
  return purry(_startsWith, arguments);
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _startsWith = (str: string, searchString: string, position?: number) => str.startsWith(searchString, position);
