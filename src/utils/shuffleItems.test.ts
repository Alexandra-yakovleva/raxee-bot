import { shuffleItems } from './shuffleItems';

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.3);
});

afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});

test('should shuffle array', () => {
  expect(shuffleItems(['a', 'b', 'c', 'd'])).toMatchSnapshot();
});

test('should accept empty array', () => {
  expect(shuffleItems([])).toStrictEqual([]);
});
