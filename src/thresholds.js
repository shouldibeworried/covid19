const r0AlertLevels = {
  0.95: 'success',
  1.05: 'info',
};
const defaultR0AlertLevel = 'danger';

const projectionPhrases = {
  0.5: 'less than half that',
  0.9: 'a smaller',
  1.1: 'about the same',
  2: 'a greater',
  3: 'more than double that',
  5: 'more than three times that',
  10: 'more than five times that',
  20: 'more than ten times that',
};
const defaultProjectionPhrase = 'more than twenty times that';

const checkLevel = (levels, defaultValue) => (
  (v) => {
    const l = Object.keys(levels).find((level) => level > v);
    return typeof l === 'undefined' ? defaultValue : levels[l];
  }
);

export const r0AlertLevel = checkLevel(r0AlertLevels, defaultR0AlertLevel);
export const projectionPhrase = checkLevel(projectionPhrases, defaultProjectionPhrase);
