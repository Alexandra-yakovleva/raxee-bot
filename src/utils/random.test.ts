import { getRandomItem, shuffleItems } from './random';

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
});

afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});

describe('getRandomItem', () => {
  test('should return value', () => {
    expect(getRandomItem(['a', 'b', 'c', 'd'])).toBe('b');
  });

  test('should return firstItem when only one is presented', () => {
    expect(getRandomItem(['a'])).toBe('a');
  });
});

describe('shuffleItems', () => {
  test('should shuffle array', () => {
    expect(shuffleItems(['a', 'b', 'c', 'd'])).toMatchSnapshot();
  });

  test('should accept empty array', () => {
    expect(shuffleItems([])).toStrictEqual([]);
  });
});
