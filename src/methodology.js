const avgDays = 7,
      genLen = 6,

      geoMean = (sequence) => Math.pow(sequence.reduce((x1, x2) => x1 * x2),
                                       1 / sequence.length),

      rNoughtSequence = (caseSequence) => {

          /* Calculate rNought by dividing new cases in current period
           * by new cases in preceding period */

          const rNought = (total, index) => (
              (total - caseSequence[index - genLen]) /
              (caseSequence[index - genLen] -
               caseSequence[index - (2 * genLen)])
          );

          return caseSequence.map(rNought).slice(2 * genLen);
      };


export { rNoughtSequence, geoMean, avgDays };
