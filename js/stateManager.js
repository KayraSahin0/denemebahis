const STORAGE_KEY = 'footballSimState_v1';

const initialState = {
  coins: 100,
  selectedCountry: null,
  selectedLeague: null,
  selectedTeam: null,
  matches: [],
  bets: [],
  history: [],
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(initialState);
    }

    try {
      const parsed = JSON.parse(raw);
      return { ...structuredClone(initialState), ...parsed, coins: Math.max(0, parsed.coins ?? 100) };
    } catch {
      return structuredClone(initialState);
    }
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.state.coins = Math.max(0, this.state.coins);
    this.saveState();
    this.notify();
  }

  placeBet(bet) {
    if (bet.amount <= 0 || bet.amount > this.state.coins) {
      return { ok: false, message: 'Invalid amount or insufficient coins.' };
    }

    this.state.coins -= bet.amount;
    this.state.bets.unshift(bet);
    this.saveState();
    this.notify();
    return { ok: true };
  }

  settleBet(result) {
    const betIndex = this.state.bets.findIndex((entry) => entry.id === result.betId);
    if (betIndex === -1) {
      return;
    }

    const bet = this.state.bets[betIndex];
    bet.status = result.win ? 'won' : 'lost';
    bet.resolvedAt = Date.now();

    if (result.win) {
      const payout = Number((bet.amount * bet.odd).toFixed(2));
      this.state.coins += payout;
      this.state.history.unshift({
        type: 'WIN',
        text: `${bet.matchLabel} | Pick ${bet.pick} won +${payout} coins`,
        at: Date.now(),
      });
    } else {
      this.state.history.unshift({
        type: 'LOSS',
        text: `${bet.matchLabel} | Pick ${bet.pick} lost -${bet.amount} coins`,
        at: Date.now(),
      });
    }

    this.saveState();
    this.notify();
  }
}

export const stateManager = new StateManager();
