const r0AlertLevels = {
  0.95: 'info',
  1.05: 'danger',
};
const defaultR0AlertLevel = 'success';

const projectionPhrases = {
  0.5: 'a smaller',
  0.9: 'about the same',
  1.1: 'a greater',
  2: 'more than double that',
  3: 'more than three times that',
  5: 'more than five times that',
  10: 'more than ten times that',
  20: 'more than twenty times that',
};
const defaultProjectionPhrase = 'less than half that';

const checkLevel = (levels, defaultValue) => (
  (v) => {
    const l = Object.keys(levels).find((level) => level < v);
    return typeof l === 'undefined' ? defaultValue : levels[l];
  }
);

export const r0AlertLevel = checkLevel(r0AlertLevels, defaultR0AlertLevel);
export const projectionPhrase = checkLevel(projectionPhrases, defaultProjectionPhrase);
