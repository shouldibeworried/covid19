import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';

import {
  rNoughtWeeklyAverage, unknownInfectionFactorMedian,
  confirmedRecentCasesPer100K, estimatedRecentCasesPer100K,
  deathFactor, recentDeaths, unknownInfectionFactorRange,
  minDeathsPerMonth,
} from './methodology';

import language from './language.json';
import {
  recentCasesAlertLevel,
  r0AlertLevel,
  r0Summary,
  projectionPhrase,
  needsDisclaimer,
} from './thresholds';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(e) {
    const { onFilterChange } = this.props;
    onFilterChange(e.target.value);
  }

  render() {
    const { country, europe, america } = this.props;
    return (
      <Navbar bg="dark" variant="dark" className="justify-content-between">
        <Navbar.Brand>
          Should I be worried?
        </Navbar.Brand>
        <Form inline>
          <Form.Control
            placeholder="Country/State/Province"
            aria-label="European Country, US State, or Canadian Province"
            title="European Country, US State, or Canadian Province"
            as="select"
            value={country}
            onChange={this.handleFilterChange}
          >
            <optgroup label="North America">
              {america.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </optgroup>
            <optgroup label="Europe">
              {europe.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </optgroup>
          </Form.Control>
        </Form>
      </Navbar>
    );
  }
}

Header.propTypes = {
  country: PropTypes.string.isRequired,
  europe: PropTypes.arrayOf(PropTypes.string).isRequired,
  america: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};


export function CurrentSituation(props) {
  const {
    country, cases, deaths, localPopulation,
  } = props;
  const recent = confirmedRecentCasesPer100K(cases, localPopulation);
  const { low, high } = unknownInfectionFactorRange(cases, deaths);
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>
            Current Situation in&nbsp;
            {country}
          </Card.Title>
          <Card.Text>
            {language.RECENTCASES.replace('{country}', country)}
          </Card.Text>
          <Alert variant={recentCasesAlertLevel(recent)}>
            {recent.toFixed(0)}
            &nbsp;per 100,000 inhabitants
          </Alert>
          <Card.Text>
            {language.RECENTCASESEXPL}
          </Card.Text>
          <Card.Text>
            {(Number.isNaN(low) || Number.isNaN(high))
              ? language.NODUNKELZIFFER
              : language.DUNKELZIFFER
                .replace(/{country}/g, country)
                .replace(/{low}/g, low.toFixed(0))
                .replace(/{high}/g, high.toFixed(0))}
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
  localPopulation: PropTypes.number.isRequired,
};


export function Outlook(props) {
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
          <Card.Title>
            Outlook for&nbsp;
            {country}
          </Card.Title>
          {Number.isNaN(r0)
            ? (
              <Card.Text>
                {language.NORNOUGHT.replace(/{country}/g, country)}
              </Card.Text>
            )
            : (
              <div>
                <Card.Text>
                  {language.RNOUGHT.replace(/{country}/g, country)}
                </Card.Text>
                <Alert variant={r0AlertLevel(r0)}>
                  r
                  <sub>0</sub>
                  &nbsp;=&nbsp;
                  {r0.toFixed(1)}
                </Alert>
                <Card.Text>
                  {language.RNOUGHTEXPL
                    .replace(/{country}/g, country)
                    .replace(/{summary}/g, r0Summary(r0))}
                </Card.Text>
                {!Number.isNaN(df) && (d > minDeathsPerMonth) && (
                  <Card.Text>
                    {needsDisclaimer(r0, df) ? language.PROJECTIONDISCLAIMER : ''}
                    {language.DEATHPROJECTION
                      .replace(/{country}/g, country)
                      .replace(/{recentDeaths}/g, d)
                      .replace(/{projectionPhrase}/g, projectionPhrase(df))}
                  </Card.Text>
                )}
              </div>
            )}
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


export function SummaryTable(props) {
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
  population: PropTypes.objectOf(PropTypes.number).isRequired,
};
