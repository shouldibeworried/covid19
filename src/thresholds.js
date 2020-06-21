const recentCasesAlertLevels = new Map([
  [0.5, 'success'],
  [10, 'info'],
  [50, 'warning'],
]);
const defaultRecentCasesAlertLevel = 'danger';

const r0AlertLevels = new Map([
  [0.95, 'success'],
  [1.05, 'info'],
]);
const defaultR0AlertLevel = 'danger';

const r0Summaries = new Map([
  [0.95, 'going down'],
  [1.05, 'more or less staying the same'],
  [1.5, 'growing exponentially'],
]);
const defaultR0Summary = 'growing exponentially at a high rate';


const projectionPhrases = new Map([
  [0.5, 'less than half as many'],
  [0.9, 'a smaller number of'],
  [1.1, 'roughly the same number of'],
  [2, 'a greater number of'],
  [3, 'more than twice as many'],
  [5, 'more than three times as many'],
  [10, 'more than five times as many'],
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
  [100000, '#a90025'],
]);
export const defaultConfirmedCasesColor = '#eeeeee';

export const estimatedCasesColors = new Map([
  [20, '#ffffcc'],
  [35, '#ffeda0'],
  [90, '#fed976'],
  [175, '#fea044'],
  [350, '#f03423'],
  [900, '#ca0d21'],
  [100000, '#a90025'],
]);
export const defaultEstimatedCasesColor = '#eeeeee';

export const r0Colors = new Map([
  [0.5, '#4575b4'],
  [0.75, '#74add1'],
  [0.95, '#c6e6f1'],
  [1.05, '#ffffbf'],
  [1.5, '#fec779'],
  [2, '#f46d43'],
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
