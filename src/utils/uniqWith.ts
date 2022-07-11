import { purry } from 'remeda';

type IsEquals<T> = (a: T, b: T) => boolean;

/**
 * Returns a new array containing only one copy of each element in the original list.
 * @param array
 * @param isEquals the comparator
 * @signature
 *    R.uniqWith(array, isEquals)
 * @example
 *    R.uniqWith([1, 2, 2, 5, 1, 6, 7], R.equals) // => [1, 2, 5, 6, 7]
 * @data_first
 * @category Array
 */
export function uniqWith<T>(array: readonly T[], isEquals: IsEquals<T>): T[];

/**
 * Returns a new array containing only one copy of each element in the original list.
 * @param isEquals the comparator
 * @signature R.uniqWith(isEquals)(array)
 * @example
 *    R.uniqWith([2, 5, 3], R.equals)([1, 2, 3, 4]) // => [1, 4]
 *    R.pipe(
 *      [1, 2, 2, 5, 1, 6, 7], // only 4 iterations
 *      R.uniqWith(R.equals),
 *      R.take(3)
 *    ) // => [1, 2, 5]
 * @data_last
 * @category Object
 */
export function uniqWith<T>(isEquals: IsEquals<T>): (array: readonly T[]) => T[];

export function uniqWith() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define, prefer-rest-params
  return purry(_uniqWith, arguments);
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
function _uniqWith<T>(array: T[], isEquals: IsEquals<T>) {
  return array.filter((a, index) => array.findIndex((b) => isEquals(a, b)) === index);
}
