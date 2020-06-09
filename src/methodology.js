const avgDays = 7;
const genLen = 6;
const infectionFatalityMin = 0.003;
const infectionFatalityMax = 0.013;
const infectionFatalityMed = 0.008;

// TODO increase when we have more data
const deathOffset = 14;

const geoMean = (sequence) => (
  sequence.reduce((x1, x2) => x1 * x2) ** (1 / sequence.length)
);

const rNoughtSequence = (cases) => {
  /* Calculate rNought by dividing new cases in current period
   * by new cases in preceding period */

  const rNought = (total, index) => (
    (total - cases[index - genLen])
    / (cases[index - genLen]
      - cases[index - (2 * genLen)])
  );

  return cases.map(rNought).slice(2 * genLen);
};

const caseFatality = (cases, deaths) => {
  /* Ratio of confirmed cases who passed after
   * deathOffset days. */

  const nCases = (
    cases[cases.length - 1 - deathOffset]
    - cases[cases.length - 1 - 2 * deathOffset]
  );
  const nDeaths = (
    deaths[cases.length - 1] - deaths[cases.length - 1 - deathOffset]
  );

  return nDeaths / nCases;
};

export {
  rNoughtSequence, geoMean, avgDays, caseFatality, infectionFatalityMin,
  infectionFatalityMax, infectionFatalityMed,
};
