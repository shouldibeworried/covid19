const avgDays = 7,
      genLen = 6,
      infectionFatalityMin = 0.003,
      infectionFatalityMax = 0.013,
      infectionFatalityMed = 0.008,

      // TODO increase when we have more data
      deathOffset = 14,

      geoMean = (sequence) => Math.pow(sequence.reduce((x1, x2) => x1 * x2),
                                       1 / sequence.length),

      rNoughtSequence = (cases) => {

          /* Calculate rNought by dividing new cases in current period
           * by new cases in preceding period */

          const rNought = (total, index) => (
              (total - cases[index - genLen]) /
              (cases[index - genLen] -
               cases[index - (2 * genLen)])
          );

          return cases.map(rNought).slice(2 * genLen);
      },
      caseFatality = (cases, deaths) => {

          /* Ratio of confirmed cases who passed after
           * deathOffset days. */

          let nCases = (cases[cases.length - 1 - deathOffset] -
                        cases[cases.length - 1 - 2 * deathOffset])
          let nDeaths = (deaths[cases.length - 1] -
                     deaths[cases.length - 1 - deathOffset])
          return nDeaths / nCases
      };

export { rNoughtSequence, geoMean, avgDays, caseFatality, infectionFatalityMin, infectionFatalityMax, infectionFatalityMed  };
