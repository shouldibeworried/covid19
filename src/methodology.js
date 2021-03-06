const week = 7;
const month = 30;

const genLen = 5;
const deathOffset = 16;

const infectionFatalityMin = 0.003;
const infectionFatalityMax = 0.010;
const infectionFatalityMed = 0.0064;

const minCasesPerGeneration = 40;
export const minDeathsPerMonth = 30;
const caseFatalityMin = 0.005;


const geoMean = (sequence) => (
  sequence.reduce((x1, x2) => x1 * x2) ** (1 / sequence.length)
);


// Calculate rNought by dividing new cases in current period by new cases in
// preceding period
const rNoughtSequence = (cases) => {
  const rNought = (total, index) => {
    const currentGeneration = total - cases[index - genLen];
    const previousGeneration = cases[index - genLen] - cases[index - (2 * genLen)];
    if (currentGeneration < minCasesPerGeneration || previousGeneration < minCasesPerGeneration) {
      return NaN;
    }
    return currentGeneration / previousGeneration;
  };

  return cases.map(rNought).slice(2 * genLen);
};


export const rNoughtWeeklyAverage = (cases) => geoMean(rNoughtSequence(cases).slice(-week));


// Ratio of confirmed cases who passed after deathOffset days.
const caseFatality = (cases, deaths) => {
  const nCases = (
    cases[cases.length - 1 - deathOffset]
    - cases[cases.length - 1 - deathOffset - month]
  );
  const nDeaths = (
    deaths[cases.length - 1] - deaths[cases.length - 1 - month]
  );

  if (nDeaths < minDeathsPerMonth) {
    return NaN;
  }

  const cf = nDeaths / nCases;

  if (cf < caseFatalityMin) {
    // this indicates underreporting of deaths
    return { low: NaN, high: NaN };
  }

  return cf;
};


export const unknownInfectionFactorRange = (cases, deaths) => {
  const cf = caseFatality(cases, deaths);
  const low = cf / infectionFatalityMax;
  const high = cf / infectionFatalityMin;
  return { low, high };
};


export const unknownInfectionFactorMedian = (cases, deaths) => (
  caseFatality(cases, deaths) / infectionFatalityMed
);


const recentCases = (cases) => {
  const current = cases[cases.length - 1];
  const previous = cases[cases.length - 1 - week];
  return current - previous;
};


export const confirmedRecentCasesPer100K = (cases, population) => (
  (100000 * recentCases(cases)) / population
);


export const estimatedRecentCasesPer100K = (cases, deaths, population) => (
  confirmedRecentCasesPer100K(cases, population) * unknownInfectionFactorMedian(cases, deaths)
);


export const recentDeaths = (deaths) => {
  const current = deaths[deaths.length - 1];
  const previous = deaths[deaths.length - 1 - month];
  return current - previous;
};


const deathProjection = (cases, deaths) => {
  /* First, compute number of cases that will contribute to next months
   * deaths. These are new cases starting from `deathOffset` days ago +
   * projected cases for following (30 - deathOffset) days */
  const current = cases[cases.length - 1];
  const previous = cases[cases.length - 1 - deathOffset];
  const existing = current - previous;

  const r0 = rNoughtWeeklyAverage(cases);
  let projected = 0;
  let recent = recentCases(cases);
  for (let i = 0; i < Math.floor((month - deathOffset) / week); i += 1) {
    recent *= r0;
    projected += recent;
  }

  const stubLength = (month - deathOffset) % week;
  const stubCases = (r0 * recent * stubLength) / week;
  projected += stubCases;

  const cf = caseFatality(cases, deaths);
  return (existing + projected) * cf;
};


export const deathFactor = (cases, deaths) => deathProjection(cases, deaths) / recentDeaths(deaths);
