import { database } from './database.js';
import { oddsEngine } from './oddsEngine.js';
import { stateManager } from './stateManager.js';
import { uiManager } from './uiManager.js';
import { PhoneSystem } from './phoneSystem.js';

const buildMatches = (teams, leagueName) => {
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const matches = [];

  for (let index = 0; index < shuffled.length - 1; index += 2) {
    const home = shuffled[index];
    const away = shuffled[index + 1];

    const { probabilities, odds } = oddsEngine.calculateMatchOdds(home, away);
    matches.push({
      id: `match_${Date.now()}_${index}`,
      league: leagueName,
      home,
      away,
      probabilities,
      odds,
      played: false,
      result: null,
    });
  }

  return matches;
};

const init = async () => {
  await database.loadDatabase();
  const countries = database.getCountries();

  let selectedCountry = stateManager.state.selectedCountry || countries[0]?.name;
  let leagues = database.getLeagues(selectedCountry);
  let selectedLeague = stateManager.state.selectedLeague || leagues[0]?.name;
  let teams = database.getTeams(selectedCountry, selectedLeague);

  stateManager.setState({ selectedCountry, selectedLeague });

  const selectUi = uiManager.renderSelectors({
    countries,
    leagues,
    teams,
    onCountryChange: (countryName) => {
      selectedCountry = countryName;
      leagues = database.getLeagues(selectedCountry);
      selectedLeague = leagues[0]?.name;
      teams = database.getTeams(selectedCountry, selectedLeague);

      selectUi.leagueSelect.innerHTML = leagues.map((league) => `<option>${league.name}</option>`).join('');
      selectUi.renderTeams(teams);
      stateManager.setState({ selectedCountry, selectedLeague, selectedTeam: null });
    },
    onLeagueChange: (leagueName) => {
      selectedLeague = leagueName;
      teams = database.getTeams(selectedCountry, selectedLeague);
      selectUi.renderTeams(teams);
      stateManager.setState({ selectedCountry, selectedLeague, selectedTeam: null });
    },
    onGenerateMatches: () => {
      const generated = buildMatches(teams, selectedLeague);
      stateManager.setState({ matches: generated });
    },
  });

  uiManager.bindState();
  new PhoneSystem();
};

init();

// Future extension hooks:
// - Live match feed integration
// - Multiplayer shared betting pools
// - Real-time API odds syncing
// - Expanded phone app ecosystem
// - Push-style notification center
