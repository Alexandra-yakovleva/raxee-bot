// eslint-disable-next-line no-restricted-imports
import { purry } from 'remeda';

export function pickBy<T extends object, K extends keyof T>(
  object: T,
  fn: (value: T[K], key: K) => boolean
): Pick<T, K>;

export function pickBy<T extends object, K extends keyof T>(
  fn: (value: T[K], key: K) => boolean
): (object: T) => Pick<T, K>;

export function pickBy() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, prefer-rest-params
  return purry(_pickBy, arguments);
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
function _pickBy(object: any, fn: (value: any, key: string) => boolean) {
  if (object == null) {
    return {};
  }
  return Object.keys(object).reduce((acc, key) => {
    if (fn(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as any);
}
