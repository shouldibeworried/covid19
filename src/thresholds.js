const recentCasesAlertLevels = new Map([
  [10, 'info'],
  [50, 'warning'],
]);
const defaultRecentCasesAlertLevel = 'danger';

const r0AlertLevels = new Map([
  [0.9, 'success'],
  [1.1, 'info'],
  [1.35, 'warning'],
]);
const defaultR0AlertLevel = 'danger';

const r0Summaries = new Map([
  [0.95, 'going down'],
  [1.05, 'more or less staying the same'],
  [1.5, 'growing exponentially'],
]);
const defaultR0Summary = 'growing exponentially at a high rate';


const projectionPhrases = new Map([
  [0.4, 'less than half as many'],
  [0.6, 'around half as many'],
  [0.9, 'a slightly smaller number of'],
  [1.1, 'roughly the same number of'],
  [1.9, 'a greater number of'],
  [2.2, 'around twice as many'],
  [2.8, 'more than twice as many'],
  [3.3, 'around three times as many'],
  [4.7, 'more than three times as many'],
  [5.5, 'around five times as many'],
  [9.5, 'more than five times as many'],
  [11, 'around ten times as many'],
  [20, 'more than ten times as many'],
]);
const defaultProjectionPhrase = 'more than twenty times as many';

export const confirmedCasesColors = new Map([
  [5, '#ffffcc'],
  [10, '#ffeda0'],
  [25, '#fed976'],
  [50, '#fea044'],
  [100, '#f03423'],
  [250, '#ca0d21'],
  [100000, '#8d001f'],
]);
export const defaultConfirmedCasesColor = '#eeeeee';

export const estimatedCasesColors = new Map([
  [25, '#ffffcc'],
  [50, '#ffeda0'],
  [100, '#fed976'],
  [250, '#fea044'],
  [500, '#f03423'],
  [1000, '#ca0d21'],
  [100000, '#8d001f'],
]);
export const defaultEstimatedCasesColor = '#eeeeee';

export const r0Colors = new Map([
  [0.6, '#4575b4'],
  [0.75, '#74add1'],
  [0.9, '#c6e6f1'],
  [1.1, '#ffffbf'],
  [1.35, '#fec779'],
  [1.65, '#f46d43'],
  [100, '#d73027'],
]);
export const defaultR0Color = '#eeeeee';

const checkLevel = (levels, defaultValue) => (
  (v) => {
    const l = Array.from(levels.keys()).find((level) => level > v);
    return typeof l === 'undefined' ? defaultValue : levels.get(l);
  }
);

export const needsDisclaimer = (r0, deathsFactor) => (
  ((r0 > 1.05) && (deathsFactor < 1.1)) || ((r0 < 0.95) && (deathsFactor > 0.9))
);

export const recentCasesAlertLevel = checkLevel(
  recentCasesAlertLevels,
  defaultRecentCasesAlertLevel,
);
export const r0AlertLevel = checkLevel(r0AlertLevels, defaultR0AlertLevel);
export const r0Summary = checkLevel(r0Summaries, defaultR0Summary);
export const projectionPhrase = checkLevel(projectionPhrases, defaultProjectionPhrase);
export const r0Color = checkLevel(r0Colors, defaultR0Color);
export const confirmedCasesColor = checkLevel(confirmedCasesColors, defaultConfirmedCasesColor);
export const estimatedCasesColor = checkLevel(estimatedCasesColors, defaultEstimatedCasesColor);
