import { getPidorCurrentDate } from './getPidorCurrentDate';

afterEach(() => {
  jest.useRealTimers();
});

test('should return current date in yyyy-MM-dd format', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2020-01-01'));

  expect(getPidorCurrentDate()).toBe('2020-01-01');
});

test('should return current date in yyyy-MM-dd-HH format when April 1', () => {
  jest
    .useFakeTimers()
    .setSystemTime(new Date('2020-04-01 13:30:45'));

  expect(getPidorCurrentDate()).toBe('2020-04-01-13');
});
