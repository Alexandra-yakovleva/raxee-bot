import { equals } from 'remeda';

import { uniqWith } from './uniqWith';

const source = [1, 2, 2, 5, 1, 6, 7];
const expected = [1, 2, 5, 6, 7];

describe('data_first', () => {
  test('should return uniq', () => {
    expect(uniqWith(source, equals)).toEqual(expected);
  });
});

describe('data_last', () => {
  test('should return uniq', () => {
    expect(uniqWith(equals)(source)).toEqual(expected);
  });
});
