import { equals } from 'remeda';

import { differenceWith } from './differenceWith';

const source = [1, 2, 3, 4] as const;
const other = [2, 5, 3] as const;
const expected = [1, 4] as const;

describe('data_first', () => {
  test('should return difference', () => {
    expect(differenceWith(source, other, equals)).toEqual(expected);
  });
});

describe('data_last', () => {
  test('should return difference', () => {
    expect(differenceWith(other, equals)(source)).toEqual(expected);
  });
});
