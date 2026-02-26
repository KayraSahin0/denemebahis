import { bettingSystem } from './bettingSystem.js';
import { matchEngine } from './matchEngine.js';
import { stateManager } from './stateManager.js';

const renderHistory = (history) => {
  const historyContainer = document.getElementById('historyContainer');
  if (!history.length) {
    historyContainer.innerHTML = '<p class="muted">No resolved bets yet.</p>';
    return;
  }

  historyContainer.innerHTML = history
    .slice(0, 25)
    .map(
      (item) => `
      <div class="history-item">
        <p class="status ${item.type === 'WIN' ? 'win' : 'lose'}">${item.type}</p>
        <p>${item.text}</p>
      </div>
    `,
    )
    .join('');
};

const createMatchCard = (match, options = { compact: false }) => {
  const container = document.createElement('div');
  container.className = 'match-card';

  container.innerHTML = `
    <div class="match-title">
      <strong>${match.home.name} vs ${match.away.name}</strong>
      <small class="muted">${match.league}</small>
    </div>

    <div class="odds-row">
      <div class="odd-pill">H ${match.odds.home}</div>
      <div class="odd-pill">D ${match.odds.draw}</div>
      <div class="odd-pill">A ${match.odds.away}</div>
    </div>

    <div class="pick-row">
      <button class="pick-btn" data-pick="HOME">Home</button>
      <button class="pick-btn" data-pick="DRAW">Draw</button>
      <button class="pick-btn" data-pick="AWAY">Away</button>
    </div>

    <div class="bet-actions">
      <input type="number" min="1" step="1" value="10" aria-label="Bet amount" />
      <button class="btn-primary">Place Bet</button>
    </div>

    <button class="btn-secondary simulate-btn">Simulate Match</button>
    <div class="status muted">${match.played ? `Result: ${match.result}` : 'Not played yet'}</div>
  `;

  let selectedPick = null;
  const pickButtons = [...container.querySelectorAll('.pick-btn')];
  const amountInput = container.querySelector('input');
  const placeBetButton = container.querySelector('.btn-primary');
  const simulateButton = container.querySelector('.simulate-btn');
  const statusField = container.querySelector('.status');

  pickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      pickButtons.forEach((entry) => entry.classList.remove('active'));
      button.classList.add('active');
      selectedPick = button.dataset.pick;
    });
  });

  placeBetButton.addEventListener('click', () => {
    const amount = Number(amountInput.value);
    if (!selectedPick) {
      statusField.textContent = 'Select an outcome first.';
      statusField.className = 'status lose';
      return;
    }

    const result = bettingSystem.placeBet(match, selectedPick, amount);
    if (!result.ok) {
      statusField.textContent = result.message;
      statusField.className = 'status lose';
      return;
    }

    statusField.textContent = `Bet placed: ${selectedPick} with ${amount} coins`;
    statusField.className = 'status win';
  });

  simulateButton.addEventListener('click', () => {
    if (match.played) {
      statusField.textContent = `Already played: ${match.result}`;
      statusField.className = 'status muted';
      return;
    }

    const result = matchEngine.simulateMatch(match);
    statusField.textContent = `Result: ${result}`;
    statusField.className = 'status win';
  });

  if (options.compact) {
    simulateButton.classList.add('hidden');
  }

  return container;
};

export const uiManager = {
  bindState() {
    stateManager.subscribe((state) => {
      document.getElementById('coinDisplay').textContent = `Coins: ${state.coins.toFixed(2)}`;

      const matchContainers = [
        document.getElementById('matchesContainer'),
        document.getElementById('phoneBettingMatches'),
      ];

      matchContainers.forEach((container, index) => {
        container.innerHTML = '';
        if (!state.matches.length) {
          container.innerHTML = '<p class="muted">Generate matches to start betting.</p>';
          return;
        }

        state.matches.forEach((match) => {
          container.appendChild(createMatchCard(match, { compact: index === 1 }));
        });
      });

      renderHistory(state.history);
    });

    stateManager.notify();
  },

  renderSelectors({ countries, leagues, teams, onCountryChange, onLeagueChange, onGenerateMatches }) {
    const countrySelect = document.getElementById('countrySelect');
    const leagueSelect = document.getElementById('leagueSelect');
    const teamsPreview = document.getElementById('teamsPreview');

    countrySelect.innerHTML = countries.map((country) => `<option>${country.name}</option>`).join('');
    leagueSelect.innerHTML = leagues.map((league) => `<option>${league.name}</option>`).join('');

    const renderTeams = (teamList) => {
      teamsPreview.innerHTML = teamList
        .map((team) => `<span class="team-chip">${team.name}</span>`)
        .join('');
    };

    renderTeams(teams);

    countrySelect.addEventListener('change', () => {
      onCountryChange(countrySelect.value);
    });

    leagueSelect.addEventListener('change', () => {
      onLeagueChange(leagueSelect.value);
    });

    document.getElementById('generateMatchesBtn').addEventListener('click', onGenerateMatches);

    return { renderTeams, countrySelect, leagueSelect };
  },
};
