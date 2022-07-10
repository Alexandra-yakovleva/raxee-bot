import { getRandomItem } from './getRandomItem';

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
});

afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});

test('should return value', () => {
  expect(getRandomItem(['a', 'b', 'c', 'd'])).toBe('b');
});

test('should return firstItem when only one is presented', () => {
  expect(getRandomItem(['a'])).toBe('a');
});
