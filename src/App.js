import React from 'react';
import logo from './logo.svg';
import './App.css';
import eu from './data/eu.json';
import population from './data/population.json';
import {
  rNoughtWeeklyAverage, unknownInfectionFactorMedian,
  confirmedRecentCasesPer100K, estimatedRecentCasesPer100K,
  deathFactor,
} from './methodology';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <table>
        <thead>
          <tr>
            <th>Country/State/Province</th>
            <th>r0</th>
            <th>unknown Infections</th>
            <th>confirmed cases per 100k</th>
            <th>estimated cases per 100k</th>
            <th>deaths next month / current month</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(eu.cases).map(
            (key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {rNoughtWeeklyAverage(eu.cases[key]).toFixed(2)}
                </td>
                <td>
                  {unknownInfectionFactorMedian(eu.cases[key], eu.deaths[key]).toFixed(2)}
                </td>
                <td>
                  {confirmedRecentCasesPer100K(eu.cases[key], population[key]).toFixed(2)}
                </td>
                <td>
                  {estimatedRecentCasesPer100K(eu.cases[key], eu.deaths[key], population[key]).toFixed(2)}
                </td>
                <td>
                  {deathFactor(eu.cases[key], eu.deaths[key]).toFixed(2)}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
