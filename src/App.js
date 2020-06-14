import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

import CovidApp from './components';

import eu from './data/eu.json';
import population from './data/population.json';


function App() {
  const props = {
    country: 'United Kingdom',
    cases: eu.cases,
    deaths: eu.deaths,
    population,
  };
  return CovidApp(props);
}

export default App;
