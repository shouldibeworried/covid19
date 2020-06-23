import {
  rNoughtWeeklyAverage,
  confirmedRecentCasesPer100K,
  deathFactor,
  recentDeaths,
  unknownInfectionFactorRange,
  minDeathsPerMonth,
} from './methodology';

test('r0 average should be 1', () => {
  const cases = [0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 200, 200, 200, 200, 200, 300, 300];
  const r0 = rNoughtWeeklyAverage(cases);
  expect(r0).toBe(1);
});

test('r0 average should be 2', () => {
  const cases = [0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 300, 300, 300, 300, 300, 700, 700];
  const r0 = rNoughtWeeklyAverage(cases);
  expect(r0).toBe(2);
});

test('not enough new cases, r0 average should be N/A', () => {
  const cases = [0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 300, 300, 300, 300, 300, 305, 700];
  const r0 = rNoughtWeeklyAverage(cases);
  expect(r0).toBe(NaN);
});
