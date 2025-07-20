// src/App.js
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import './App.css';
import { players } from './Dashboard';

function App() {
  const [player, setPlayer] = useState(players[0].name);
  const [timeFrame, setTimeFrame] = useState('season');
  const [metric, setMetric] = useState('PTS');
  const [lang, setLang] = useState('en');

  const labels = {
    en: {
      title: 'AT Basketball League',
      season: 'Season', last10: 'Last 10 Games', bySeason: 'By Season', last10Opt: 'Last 10 Games',
      filters: 'Filters: ', player: 'Player: ', metric: 'Metric: ',
      pts: 'Points Per Game', ast: 'Assists Per Game', reb: 'Rebounds Per Game',
      ptsTotal: 'Total Points', astTotal: 'Total Assists', rebTotal: 'Total Rebounds',
      pie: 'Distribution'
    },
    fr: {
      title: 'Ligue de basketball AT',
      season: 'Saison', last10: '10 Derniers matchs', bySeason: 'Par Saison', last10Opt: '10 Derniers',
      filters: 'Filtres : ', player: 'Joueur : ', metric: 'Métrique : ',
      pts: 'Points par match', ast: 'Passes par match', reb: 'Rebonds par match',
      ptsTotal: 'Points totaux', astTotal: 'Passes totales', rebTotal: 'Rebonds totaux',
      pie: 'Répartition'
    }
  };
  const colors = { PTS: '#8884d8', AST: '#82ca9d', REB: '#ffc658' };

  const selected = players.find(p => p.name === player);
  const lbl = labels[lang];

  const seasonAvg = selected.seasonStats.reduce(
    (acc, s) => ({ PTS: acc.PTS + s.PTS, AST: acc.AST + s.AST, REB: acc.REB + s.DRB }),
    { PTS: 0, AST: 0, REB: 0 }
  );
  seasonAvg.PTS /= selected.seasonStats.length;
  seasonAvg.AST /= selected.seasonStats.length;
  seasonAvg.REB /= selected.seasonStats.length;

  const tableRows = timeFrame === 'season'
    ? selected.seasonStats
    : [{
      label: lbl.last10,
      GP: selected.lastGamesPTS.length,
      MIN: (selected.lastGamesPTS.reduce((s,a) => s + a, 0) / selected.lastGamesPTS.length).toFixed(1),
      PTS: (selected.lastGamesPTS.reduce((s,a) => s + a, 0) / selected.lastGamesPTS.length).toFixed(1),
      AST: (selected.lastGamesAST.reduce((s,a) => s + a, 0) / selected.lastGamesAST.length).toFixed(1),
      REB: (selected.lastGamesREB.reduce((s,a) => s + a, 0) / selected.lastGamesREB.length).toFixed(1)
    }];

  const barData = timeFrame === 'season'
    ? selected.seasonStats.map(s => ({ name: s.season, PTS: s.PTS, AST: s.AST, REB: s.DRB }))
    : [{ name: lbl.last10, PTS: tableRows[0].PTS, AST: tableRows[0].AST, REB: tableRows[0].REB }];

  const lineData = timeFrame === 'season'
    ? barData.map(d => ({ name: d.name, value: d[metric] }))
    : selected[`lastGames${metric}`].map((v, i) => ({ name: `G${i+1}`, value: v }));

  const last10Sum = {
    PTS: selected.lastGamesPTS.reduce((s,a) => s + a, 0),
    AST: selected.lastGamesAST.reduce((s,a) => s + a, 0),
    REB: selected.lastGamesREB.reduce((s,a) => s + a, 0)
  };

  const pieData = [
    {
      name: timeFrame === 'season' ? lbl.pts : lbl.ptsTotal,
      value: timeFrame === 'season' ? seasonAvg.PTS : last10Sum.PTS
    },
    {
      name: timeFrame === 'season' ? lbl.ast : lbl.astTotal,
      value: timeFrame === 'season' ? seasonAvg.AST : last10Sum.AST
    },
    {
      name: timeFrame === 'season' ? lbl.reb : lbl.rebTotal,
      value: timeFrame === 'season' ? seasonAvg.REB : last10Sum.REB
    }
  ];

  return (
    <div className="App">
      <h1 className="main-title">{lbl.title}</h1>
      <h3 className="player-title">{player} Stats</h3>

      <div className="controls">
        <label>{lbl.player}
          <select value={player} onChange={e => setPlayer(e.target.value)}>
            {players.map(p => <option key={p.name}>{p.name}</option>)}
          </select>
        </label>
        <label>{lbl.filters}
          <select value={timeFrame} onChange={e => setTimeFrame(e.target.value)}>
            <option value="season">{lbl.bySeason}</option>
            <option value="last10">{lbl.last10Opt}</option>
          </select>
        </label>
        <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}>
          {lang === 'en' ? 'Français' : 'English'}
        </button>
      </div>

      <table className="stats-table">
        <thead>
          <tr>
            <th>{timeFrame === 'season' ? lbl.season : lbl.last10}</th>
            <th>GP</th><th>MIN</th><th>{lbl.pts}</th><th>{lbl.ast}</th><th>{lbl.reb}</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((r, i) => (
            <tr key={i}>
              <td>{r.season || r.label}</td>
              <td>{r.GP}</td><td>{r.MIN}</td><td>{r.PTS}</td><td>{r.AST}</td>
              <td>{timeFrame === 'season' ? r.DRB : r.REB}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="charts-grid">
        <div>
          <h3>{lang === 'en' ? 'Bar Chart' : 'Graphique en barres'}</h3>
          <BarChart width={350} height={220} data={barData} margin={{ top:10, right:10, left:10, bottom:10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="PTS" fill={colors.PTS} />
            <Bar dataKey="AST" fill={colors.AST} />
            <Bar dataKey="REB" fill={colors.REB} />
          </BarChart>
        </div>

        <div>
          <div className="metric-selector">
            <label>{lbl.metric}
              <select value={metric} onChange={e => setMetric(e.target.value)}>
                <option value="PTS">{lbl.pts}</option>
                <option value="AST">{lbl.ast}</option>
                <option value="REB">{lbl.reb}</option>
              </select>
            </label>
            <h3>{lang === 'en' ? 'Trend' : 'Tendance'}</h3>
          </div>
          <LineChart width={350} height={220} data={lineData} margin={{ top:10, right:10, left:10, bottom:10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={colors[metric]} name={labels[lang][metric.toLowerCase()]} />
          </LineChart>
        </div>

        <div>
          <h3>{lbl.pie}</h3>
          <PieChart width={350} height={220}>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
              {pieData.map((entry, i) => <Cell key={i} fill={colors[Object.keys(colors)[i]]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <footer className="footer">
        <p>{lang === 'en'
          ? 'Disclaimer: These statistics are fake and for demonstration purposes only.'
          : 'Avertissement : Ces statistiques sont fictives et fournies à des fins de démonstration uniquement.'
        }</p>
      </footer>
    </div>
  );
}

export default App;