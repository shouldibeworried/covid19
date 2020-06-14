import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';


import {
  rNoughtWeeklyAverage, unknownInfectionFactorMedian,
  confirmedRecentCasesPer100K, estimatedRecentCasesPer100K,
  deathFactor,
} from './methodology';

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


function CurrentSituation() {
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Current Situation</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}


function Outlook() {
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Outlook</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}


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
          <CurrentSituation cases={cases} deaths={deaths} population={population} />
          <Outlook cases={cases} deaths={deaths} population={population} />
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
