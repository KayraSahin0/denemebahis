import { stateManager } from './stateManager.js';

const weightedRandomResult = (probabilities) => {
  const random = Math.random();
  if (random < probabilities.home) {
    return 'HOME';
  }
  if (random < probabilities.home + probabilities.draw) {
    return 'DRAW';
  }
  return 'AWAY';
};

export const matchEngine = {
  simulateMatch(match) {
    const result = weightedRandomResult(match.probabilities);
    const relatedBets = stateManager.state.bets.filter(
      (bet) => bet.matchId === match.id && bet.status === 'pending',
    );

    relatedBets.forEach((bet) => {
      const win = bet.pick === result;
      stateManager.settleBet({ betId: bet.id, win });
    });

    const updatedMatches = stateManager.state.matches.map((entry) =>
      entry.id === match.id ? { ...entry, result, played: true } : entry,
    );

    stateManager.setState({ matches: updatedMatches });
    return result;
  },
};
