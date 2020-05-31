import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import eu from './data/eu';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <table>
          <tbody>
            {Object.keys(eu.cases).map(
                (key) => <tr key={key}>
                  <td>{key}</td>
                  {eu.cases[key].map(
                      (casenum) => <td key={casenum}>{casenum}</td>
                  )}
                </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
