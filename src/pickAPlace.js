const longCodes = {
  'de-at': 'Austria',
  'fr-be': 'Belgium',
  'nl-be': 'Belgium',
  'sv-fi': 'Finland',
  'en-ie': 'Ireland',
  'de-li': 'Liechtenstein',
  'fr-lu': 'Luxembourg',
  'de-lu': 'Luxembourg',
  'fr-ch': 'Switzerland',
  'de-ch': 'Switzerland',
  'it-ch': 'Switzerland',
  'en-gb': 'United Kingdom',
  'en-ca': 'Ontario',
  'en-us': 'California',
};

const shortCodes = {
  bg: 'Bulgaria',
  hr: 'Croatia',
  cs: 'Czechia',
  da: 'Denmark',
  et: 'Estonia',
  fi: 'Finland',
  fr: 'France',
  de: 'Germany',
  el: 'Greece',
  hu: 'Hungary',
  is: 'Iceland',
  it: 'Italy',
  lv: 'Latvia',
  lt: 'Lithuania',
  mt: 'Malta',
  nl: 'Netherlands',
  no: 'Norway',
  nb: 'Norway',
  nn: 'Norway',
  pl: 'Poland',
  pt: 'Portugal',
  ro: 'Romania',
  sk: 'Slovakia',
  sl: 'Slovenia',
  es: 'Spain',
  sv: 'Sweden',
  rm: 'Switzerland',
  en: 'California',
};


const pickAPlace = () => {
  const lang = navigator.language.toLowerCase();

  if (lang in longCodes) {
    return longCodes[lang];
  }

  if (lang.substring(0, 2) in shortCodes) {
    return shortCodes[lang.substring(0, 2)];
  }

  return 'California';
};


export default pickAPlace;
