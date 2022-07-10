import { buildPidorStatsMessageVariant, getPidorCurrentDate, getPidorStats } from './pidor';

describe('buildPidorStatsMessageVariant', () => {
  test('should return same value', () => {
    const statsVariant = {
      row: () => '',
      title: () => '',
      total: () => '',
    };

    expect(buildPidorStatsMessageVariant(statsVariant)).toBe(statsVariant);
  });
});

describe('getPidorCurrentDate', () => {
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
});

describe('getPidorStats', () => {
  test('should count stats', () => {
    const items = {
      '2022-07-01': 1,
      '2022-07-02': 2,
      '2022-07-03': 1,
      '2022-07-04': 1,
      '2022-07-05': 2,
      '2022-07-06': 1,
      '2022-07-07': 1,
      '2022-07-08': 3,
      '2022-07-09': 3,
      '2022-07-10': 2,
    };

    const users = {
      1: { first_name: '', id: 1, is_bot: false },
      2: { first_name: '', id: 2, is_bot: false },
      3: { first_name: '', id: 3, is_bot: false },
    };

    expect(getPidorStats(items, users)).toMatchSnapshot();
  });
});
