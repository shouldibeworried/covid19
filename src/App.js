import React from 'react';
import logo from './logo.svg';
import './App.css';
import eu from './data/eu.json';

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
          {Object.keys(eu.cases).map(
            (key) => (
              <tr key={key}>
                <td>{key}</td>
                {eu.cases[key].map(
                  (casenum) => <td key={casenum}>{casenum}</td>,
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
