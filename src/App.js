import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

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
      <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Should I be worried about Covid-19?</Navbar.Brand>
      </Navbar>
      <Container>
        <Row>
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
        </Row>
      </Container>
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
