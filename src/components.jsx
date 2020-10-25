import React from 'react';
import PropTypes from 'prop-types';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
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
    const { country, europe, america, de } = this.props;
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
            <optgroup label="Germany">
              {de.map((c) => (
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
  de: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};


export function CurrentSituation(props) {
  const {
    country, cases, deaths, localPopulation,
  } = props;
  const recent = confirmedRecentCasesPer100K(cases, localPopulation);
  const { low, high } = unknownInfectionFactorRange(cases, deaths);
  return (
    <div className="mt-4">
      <h5>
        Current situation in&nbsp;
        {maybeThe(country)}
      </h5>
      <p>
        {language.RECENTCASES.replace('{country}', maybeThe(country))}
      </p>
      <Alert variant={recentCasesAlertLevel(recent)}>
        {recent.toFixed(0)}
        &nbsp;per 100,000 inhabitants
      </Alert>
      <p>
        {language.RECENTCASESEXPL}
      </p>
      <p>
        {(Number.isNaN(low) || Number.isNaN(high))
          ? language.NODUNKELZIFFER
          : language.DUNKELZIFFER
            .replace(/{country}/g, maybeThe(country))
            .replace(/{low}/g, low.toFixed(0))
            .replace(/{high}/g, high.toFixed(0))}
      </p>
    </div>
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
    <div className="mt-4">
      <h5>
        Outlook for&nbsp;
        {maybeThe(country)}
      </h5>
      {Number.isNaN(r0)
        ? (
          <p>
            {language.NORNOUGHT.replace(/{country}/g, maybeThe(country))}
          </p>
        )
        : (
          <div>
            <p>
              {language.RNOUGHT.replace(/{country}/g, maybeThe(country))}
            </p>
            <Alert variant={r0AlertLevel(r0)}>
              R
              <sub>0</sub>
              &nbsp;=&nbsp;
              {r0.toFixed(1)}
            </Alert>
            <p>
              {language.RNOUGHTEXPL
                .replace(/{country}/g, maybeThe(country))
                .replace(/{summary}/g, r0Summary(r0))}
            </p>
            {!Number.isNaN(df) && (d > minDeathsPerMonth) && (
              <p>
                {needsDisclaimer(r0, df) ? language.PROJECTIONDISCLAIMER : ''}
                {language.DEATHPROJECTION
                  .replace(/{country}/g, maybeThe(country))
                  .replace(/{recentDeaths}/g, d)
                  .replace(/{projectionPhrase}/g, projectionPhrase(df))}
              </p>
            )}
          </div>
        )}
    </div>
  );
}

Outlook.propTypes = {
  country: PropTypes.string.isRequired,
  cases: PropTypes.arrayOf(PropTypes.number).isRequired,
  deaths: PropTypes.arrayOf(PropTypes.number).isRequired,
};
