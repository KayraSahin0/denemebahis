const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const teamStrength = (team) => {
  const attack = team.attack * 0.4;
  const defense = team.defense * 0.3;
  const form = team.form * 0.2;
  const morale = team.morale * 100 * 0.1;
  return attack + defense + form + morale;
};

export const oddsEngine = {
  calculateMatchOdds(homeTeam, awayTeam) {
    const homeStrengthRaw = teamStrength(homeTeam) * 1.1; // 10% home advantage boost
    const awayStrengthRaw = teamStrength(awayTeam);
    const totalStrength = homeStrengthRaw + awayStrengthRaw;

    // Draw kept in realistic range (20-30%) and adjusted by parity.
    const parityGap = Math.abs(homeStrengthRaw - awayStrengthRaw) / totalStrength;
    const drawProbability = clamp(0.29 - parityGap * 0.18, 0.2, 0.3);

    const nonDrawPool = 1 - drawProbability;
    let homeProbability = (homeStrengthRaw / totalStrength) * nonDrawPool;
    let awayProbability = (awayStrengthRaw / totalStrength) * nonDrawPool;

    const marginFactor = 1.08;
    homeProbability *= marginFactor;
    awayProbability *= marginFactor;
    const adjustedDrawProbability = drawProbability * marginFactor;

    const overround = homeProbability + awayProbability + adjustedDrawProbability;
    homeProbability /= overround;
    awayProbability /= overround;
    const finalDrawProbability = adjustedDrawProbability / overround;

    return {
      probabilities: {
        home: homeProbability,
        draw: finalDrawProbability,
        away: awayProbability,
      },
      odds: {
        home: Number((1 / homeProbability).toFixed(2)),
        draw: Number((1 / finalDrawProbability).toFixed(2)),
        away: Number((1 / awayProbability).toFixed(2)),
      },
    };
  },
};
