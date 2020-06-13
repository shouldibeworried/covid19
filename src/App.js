import React from 'react';
import logo from './logo.svg';
import './App.css';
import na from './data/na.json';
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
        <tbody>
          {Object.keys(na.cases).map(
            (key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {rNoughtWeeklyAverage(na.cases[key])}
                </td>
                <td>
                  {unknownInfectionFactorMedian(na.cases[key], na.deaths[key])}
                </td>
                <td>
                  {confirmedRecentCasesPer100K(na.cases[key], population[key])}
                </td>
                <td>
                  {estimatedRecentCasesPer100K(na.cases[key], na.deaths[key], population[key])}
                </td>
                <td>
                  {deathFactor(na.cases[key], na.deaths[key])}
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
