import { isFirstApril, isHalloween } from './date';

describe('isFirstApril', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return true on April 1', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-04-01'));

    expect(isFirstApril()).toBe(true);
  });

  test('should return false on any other day', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-01-01'));

    expect(isFirstApril()).toBe(false);
  });
});

describe('isHalloween', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return true on Halloween', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-31'));

    expect(isHalloween()).toBe(true);
  });

  test('should return true week before Halloween', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-25'));

    expect(isHalloween()).toBe(true);

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-26'));

    expect(isHalloween()).toBe(true);

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-28'));

    expect(isHalloween()).toBe(true);
  });

  test('should return false on any other day', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-10-24'));

    expect(isHalloween()).toBe(false);

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-11-01'));

    expect(isHalloween()).toBe(false);

    jest
      .useFakeTimers()
      .setSystemTime(new Date('2020-01-01'));

    expect(isHalloween()).toBe(false);
  });
});
