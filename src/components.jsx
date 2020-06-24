import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';

import {
  rNoughtWeeklyAverage,
  confirmedRecentCasesPer100K,
  deathFactor,
  recentDeaths,
  unknownInfectionFactorRange,
  minDeathsPerMonth,
} from './methodology';

import language from './language.json';
import { needsThe } from './settings.json';

import {
  recentCasesAlertLevel,
  r0AlertLevel,
  r0Summary,
  projectionPhrase,
  needsDisclaimer,
} from './thresholds';


const maybeThe = (country) => (needsThe.includes(country) ? `the ${country}` : country);

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
            Current situation in&nbsp;
            {maybeThe(country)}
          </Card.Title>
          <Card.Text>
            {language.RECENTCASES.replace('{country}', maybeThe(country))}
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
                .replace(/{country}/g, maybeThe(country))
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
            {maybeThe(country)}
          </Card.Title>
          {Number.isNaN(r0)
            ? (
              <Card.Text>
                {language.NORNOUGHT.replace(/{country}/g, maybeThe(country))}
              </Card.Text>
            )
            : (
              <div>
                <Card.Text>
                  {language.RNOUGHT.replace(/{country}/g, maybeThe(country))}
                </Card.Text>
                <Alert variant={r0AlertLevel(r0)}>
                  R
                  <sub>0</sub>
                  &nbsp;=&nbsp;
                  {r0.toFixed(1)}
                </Alert>
                <Card.Text>
                  {language.RNOUGHTEXPL
                    .replace(/{country}/g, maybeThe(country))
                    .replace(/{summary}/g, r0Summary(r0))}
                </Card.Text>
                {!Number.isNaN(df) && (d > minDeathsPerMonth) && (
                  <Card.Text>
                    {needsDisclaimer(r0, df) ? language.PROJECTIONDISCLAIMER : ''}
                    {language.DEATHPROJECTION
                      .replace(/{country}/g, maybeThe(country))
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
