import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import {
  Header, CurrentSituation, Outlook, SummaryTable,
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


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: 'California',
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(country) {
    this.setState({ country });
  }

  render() {
    const { country } = this.state;
    const cases = country in eu.cases ? eu.cases : na.cases;
    const deaths = country in eu.deaths ? eu.deaths : na.deaths;
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
            <RecentCasesMap mapType={mapType} cases={cases} deaths={deaths} population={population} />
            <R0Map mapType={mapType} cases={cases} />
          </Row>
          <Row>
            <SummaryTable cases={cases} deaths={deaths} population={population} />
          </Row>
          <Row>
            <p>
              Data:
              <a href="https://github.com/CSSEGISandData/COVID-19">
                Johns Hopkins University
              </a>
              ; maps adapted from:
              <a href="https://www.naturalearthdata.com">
                Natural Earth
              </a>
            </p>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
