import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import {
  Header, CurrentSituation, Outlook,
} from './components';
import {
  naMap,
  euMap,
  R0Map,
  RecentCasesMap,
} from './maps';

import eu from './data/eu.json';
import na from './data/na.json';
import population from './data/population.json';
import pickAPlace from './pickAPlace';


class App extends React.Component {
  constructor(props) {
    super(props);
    const country = pickAPlace();
    this.state = { country };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(country) {
    if (country in eu.cases || country in na.cases) {
      this.setState({ country });
      window.location.hash = country;
    }
  }

  render() {
    const { country } = this.state;
    const cases = country in eu.cases ? eu.cases : na.cases;
    const deaths = country in eu.deaths ? eu.deaths : na.deaths;
    const lastUpdatedDate = country in eu.cases ? eu.dates.slice(-1)[0] : na.dates.slice(-1)[0];
    const mapType = country in eu.cases ? euMap : naMap;
    return (
      <div className="App">
        <Header
          country={country}
          europe={Object.keys(eu.cases)}
          america={Object.keys(na.cases)}
          onFilterChange={this.handleFilterChange}
        />
        <Container>
          <Row>
            <CurrentSituation
              country={country}
              cases={cases[country]}
              deaths={deaths[country]}
              localPopulation={population[country]}
            />
            <Outlook
              country={country}
              cases={cases[country]}
              deaths={deaths[country]}
            />
          </Row>
          <Row>
            <RecentCasesMap
              mapType={mapType}
              cases={cases}
              deaths={deaths}
              population={population}
              onCountryChange={this.handleFilterChange}
            />
            <R0Map mapType={mapType} cases={cases} onCountryChange={this.handleFilterChange} />
          </Row>
          <Row>
            <p>
              Data:&nbsp;
              <a href="https://github.com/CSSEGISandData/COVID-19">
                Johns Hopkins University
              </a>
              ; map shapes from:&nbsp;
              <a href="https://www.naturalearthdata.com">
                Natural Earth
              </a>
              ; includes data as of&nbsp;
              {lastUpdatedDate}
              ;
            </p>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
