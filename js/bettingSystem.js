import { stateManager } from './stateManager.js';

const createBetId = () => `bet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const bettingSystem = {
  placeBet(match, pick, amount) {
    const oddKey = pick.toLowerCase();
    const odd = match.odds[oddKey];

    return stateManager.placeBet({
      id: createBetId(),
      matchId: match.id,
      matchLabel: `${match.home.name} vs ${match.away.name}`,
      pick,
      amount,
      odd,
      status: 'pending',
      placedAt: Date.now(),
    });
  },
};
