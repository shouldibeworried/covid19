const r0AlertLevels = new Map([
  [0.95, 'success'],
  [1.05, 'info'],
]);
const defaultR0AlertLevel = 'danger';

const projectionPhrases = new Map([
  [0.5, 'less than half as many'],
  [0.9, 'a smaller number of'],
  [1.1, 'about the same number of'],
  [2, 'a greater number of'],
  [3, 'more than twice as many'],
  [5, 'more than three times as many'],
  [10, 'more than five times as many'],
  [20, 'more than ten times as many'],
]);
const defaultProjectionPhrase = 'more than twenty times as many';

const checkLevel = (levels, defaultValue) => (
  (v) => {
    const l = Array.from(levels.keys()).find((level) => level > v);
    return typeof l === 'undefined' ? defaultValue : levels.get(l);
  }
);

export const r0AlertLevel = checkLevel(r0AlertLevels, defaultR0AlertLevel);
export const projectionPhrase = checkLevel(projectionPhrases, defaultProjectionPhrase);
