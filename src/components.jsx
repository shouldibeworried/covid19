import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import {
  rNoughtWeeklyAverage, unknownInfectionFactorMedian,
  confirmedRecentCasesPer100K, estimatedRecentCasesPer100K,
  deathFactor, recentDeaths,
} from './methodology';

import language from './language.json';
import { r0AlertLevel, projectionPhrase } from './thresholds';


function Header(props) {
  const { country } = props;
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        Should I be worried about Covid-19 in&nbsp;
        {country}
        ?
      </Navbar.Brand>
    </Navbar>
  );
}

Header.propTypes = {
  country: PropTypes.string.isRequired,
};


function CurrentSituation(props) {
  const {
    country, cases, deaths, population,
  } = props;
  const r0 = rNoughtWeeklyAverage(cases);
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Current Situation</Card.Title>
          <Card.Text>
            <p>
              {language.RNOUGHT.replace('{country}', country)}
            </p>
            <Alert variant={r0AlertLevel(r0)}>
              r<sub>0</sub> =&nbsp;
              {r0.toFixed(1)}
            </Alert>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

CurrentSituation.propTypes = {
  country: PropTypes.string.isRequired,
  cases: PropTypes.arrayOf(PropTypes.number).isRequired,
  deaths: PropTypes.arrayOf(PropTypes.number).isRequired,
  population: PropTypes.arrayOf(PropTypes.number).isRequired,
};


function Outlook(props) {
  const {
    country, cases, deaths,
  } = props;
  const r0 = rNoughtWeeklyAverage(cases);
  const d = recentDeaths(deaths);
  const df = deathFactor(cases, deaths);
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Outlook</Card.Title>
          <Card.Text>
            <p>
              {language.RNOUGHT.replace(/{country}/g, country)}
            </p>
            <Alert variant={r0AlertLevel(r0)}>
              r
              <sub>0</sub>
              &nbsp;=&nbsp;
              {r0.toFixed(1)}
            </Alert>
            <p>
              {language.RNOUGHTEXPL}
            </p>
            <p>
              {language.DEATHPROJECTION
                .replace(/{country}/g, country)
                .replace(/{recentDeaths}/g, d)
                .replace(/{projectionPhrase}/g, projectionPhrase(df))}
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}

Outlook.propTypes = {
  country: PropTypes.string.isRequired,
  cases: PropTypes.arrayOf(PropTypes.number).isRequired,
  deaths: PropTypes.arrayOf(PropTypes.number).isRequired,
};


function SummaryTable(props) {
  const { cases, deaths, population } = props;
  return (
    <Table>
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
        {Object.keys(cases).map(
          (key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {rNoughtWeeklyAverage(cases[key]).toFixed(2)}
              </td>
              <td>
                {unknownInfectionFactorMedian(cases[key], deaths[key]).toFixed(2)}
              </td>
              <td>
                {confirmedRecentCasesPer100K(cases[key], population[key]).toFixed(2)}
              </td>
              <td>
                {estimatedRecentCasesPer100K(cases[key], deaths[key], population[key]).toFixed(2)}
              </td>
              <td>
                {deathFactor(cases[key], deaths[key]).toFixed(2)}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

SummaryTable.propTypes = {
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  deaths: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  population: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};


function CovidApp(props) {
  const {
    country, cases, deaths, population,
  } = props;
  return (
    <div className="App">
      <Header country={country} />
      <Container>
        <Row>
          <CurrentSituation
            country={country}
            cases={cases[country]}
            deaths={deaths[country]}
            population={population[country]}
          />
          <Outlook
            country={country}
            cases={cases[country]}
            deaths={deaths[country]}
          />
        </Row>
        <Row>
          <SummaryTable cases={cases} deaths={deaths} population={population} />
        </Row>
      </Container>
    </div>
  );
}

CovidApp.propTypes = {
  country: PropTypes.string.isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  deaths: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  population: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};


export default CovidApp;
