// TODO: Replace with Excel JSON.
// Excel integration plan:
// 1) Convert Excel workbook into JSON with countries > leagues > teams schema.
// 2) Place exported JSON in /data (e.g., /data/football-db.json).
// 3) Replace MOCK_DATABASE fallback with fetch('/data/football-db.json') inside loadDatabase().
// 4) Keep the same accessor methods so UI and engines remain unchanged.

const MOCK_DATABASE = {
  countries: [
    {
      name: 'Spain',
      leagues: [
        {
          name: 'La Liga',
          teams: [
            { name: 'Barcelona', attack: 90, defense: 84, form: 78, morale: 0.85 },
            { name: 'Real Madrid', attack: 92, defense: 86, form: 82, morale: 0.9 },
            { name: 'Atletico Madrid', attack: 84, defense: 88, form: 74, morale: 0.8 },
            { name: 'Real Sociedad', attack: 79, defense: 80, form: 69, morale: 0.73 },
            { name: 'Sevilla', attack: 77, defense: 76, form: 66, morale: 0.68 },
            { name: 'Athletic Club', attack: 75, defense: 79, form: 70, morale: 0.74 },
          ],
        },
      ],
    },
    {
      name: 'England',
      leagues: [
        {
          name: 'Premier League',
          teams: [
            { name: 'Manchester City', attack: 94, defense: 88, form: 84, morale: 0.92 },
            { name: 'Liverpool', attack: 91, defense: 83, form: 81, morale: 0.87 },
            { name: 'Arsenal', attack: 88, defense: 84, form: 79, morale: 0.85 },
            { name: 'Chelsea', attack: 81, defense: 79, form: 72, morale: 0.75 },
            { name: 'Tottenham', attack: 84, defense: 77, form: 74, morale: 0.77 },
            { name: 'Newcastle', attack: 80, defense: 81, form: 73, morale: 0.78 },
          ],
        },
      ],
    },
    {
      name: 'Germany',
      leagues: [
        {
          name: 'Bundesliga',
          teams: [
            { name: 'Bayern Munich', attack: 93, defense: 86, form: 82, morale: 0.9 },
            { name: 'Leverkusen', attack: 86, defense: 82, form: 80, morale: 0.88 },
            { name: 'Dortmund', attack: 87, defense: 80, form: 76, morale: 0.83 },
            { name: 'RB Leipzig', attack: 84, defense: 79, form: 74, morale: 0.8 },
            { name: 'Frankfurt', attack: 79, defense: 76, form: 70, morale: 0.73 },
            { name: 'Wolfsburg', attack: 76, defense: 75, form: 67, morale: 0.69 },
          ],
        },
      ],
    },
  ],
};

class Database {
  constructor() {
    this.data = null;
  }

  async loadDatabase() {
    // Future-ready shape for async Excel JSON loading.
    this.data = MOCK_DATABASE;
    return this.data;
  }

  getCountries() {
    return this.data?.countries ?? [];
  }

  getLeagues(countryName) {
    const country = this.getCountries().find((entry) => entry.name === countryName);
    return country?.leagues ?? [];
  }

  getTeams(countryName, leagueName) {
    const league = this.getLeagues(countryName).find((entry) => entry.name === leagueName);
    return league?.teams ?? [];
  }
}

export const database = new Database();
