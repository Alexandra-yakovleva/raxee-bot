import { buildPidorStatsMessageVariant } from './buildPidorStatsMessageVariant';

test('should return same value', () => {
  const statsVariant = {
    row: () => '',
    title: () => '',
    total: () => '',
  };

  expect(buildPidorStatsMessageVariant(statsVariant)).toBe(statsVariant);
});
