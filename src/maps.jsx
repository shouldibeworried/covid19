import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import { rNoughtWeeklyAverage, confirmedRecentCasesPer100K, estimatedRecentCasesPer100K } from './methodology';
import {
  r0Color,
  r0Colors,
  defaultR0Color,
  confirmedCasesColor,
  confirmedCasesColors,
  defaultConfirmedCasesColor,
  estimatedCasesColor,
  estimatedCasesColors,
  defaultEstimatedCasesColor,
} from './thresholds';


export const naMap = {
  geoUrl: 'maps/northamerica.json',
  projection: 'geoAlbers',
  projectionConfig: { rotate: [100, -9, 0], scale: 800 },
};

export const euMap = {
  geoUrl: 'maps/europe.json',
  projection: 'geoAzimuthalEqualArea',
  projectionConfig: { rotate: [-10.0, -52.0, 0], scale: 1000 },
};

export const colorMapFactory = (getValue, colorScale, defaultColor) => ((name) => {
  const value = getValue(name);
  return Number.isNaN(value) ? defaultColor : colorScale(value);
});


const Map = (props) => {
  const { mapType, colorMap, onCountryChange } = props;
  const { geoUrl, projection, projectionConfig } = mapType;
  return (
    <ComposableMap
      projection={projection}
      projectionConfig={projectionConfig}
      viewBox="0 0 800 600"
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => (onCountryChange(geo.properties.NAME_EN))}
              fill={colorMap(geo.properties.NAME_EN)}
              stroke="grey"
            />
          ))
        )}
      </Geographies>
    </ComposableMap>
  );
};

const propTypeMap = PropTypes.shape({
  geoUrl: PropTypes.string,
  projection: PropTypes.string,
  projectionConfig: PropTypes.shape({
    rotate: PropTypes.arrayOf(PropTypes.number),
    scale: PropTypes.number,
  }),
});

Map.propTypes = {
  mapType: propTypeMap.isRequired,
  colorMap: PropTypes.func.isRequired,
  onCountryChange: PropTypes.func.isRequired,
};


const LegendEntry = (props) => {
  const { text, color } = props;
  return (
    <span style={{ paddingRight: '10px', display: 'inline-block' }}>
      <svg
        className="bi bi-square-fill"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        fill={color}
        stroke="grey"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="16" height="16" rx="2" />
      </svg>
      {text}
    </span>
  );
};

LegendEntry.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const Legend = (props) => {
  const { colorArray } = props;
  return (
    <div style={{ margin: '5px 0' }}>
      {colorArray.slice(0, -1).map(([key, value]) => (
        <LegendEntry key={key} text={` < ${key}`} color={value} />
      ))}
      <LegendEntry
        key={colorArray.slice(-1)[0][0]}
        text={` \u{2265} ${colorArray.slice(-2)[0][0]}`}
        color={colorArray.slice(-1)[0][1]}
      />
    </div>
  );
};

Legend.propTypes = {
  colorArray: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  )).isRequired,
};


export const R0Map = (props) => {
  const { mapType, cases, onCountryChange } = props;
  const colorMap = colorMapFactory(
    (name) => (name in cases ? rNoughtWeeklyAverage(cases[name]) : NaN),
    r0Color,
    defaultR0Color,
  );
  return (
    <Card className="mt-4">
      <Card.Header>
        Basic reproduction number
      </Card.Header>
      <Card.Body>
        <Map mapType={mapType} colorMap={colorMap} onCountryChange={onCountryChange} />
        <Legend colorArray={Array.from(r0Colors)} />
        <Card.Text>
          The basic reproduction number indicates whether infection rates are
          going down (blue) or up (red). See the&nbsp;
          <a href="https://github.com/shouldibeworried/covid19#basic-reproduction-number">
            README
          </a>
          &nbsp;for more information.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

R0Map.propTypes = {
  mapType: propTypeMap.isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onCountryChange: PropTypes.func.isRequired,
};


const ConfirmedEstdToggle = (props) => {
  const { showEstimated, onToggleChange } = props;

  return (
    <ToggleButtonGroup type="radio" name="conf-estd" value={showEstimated} onChange={onToggleChange}>
      <ToggleButton variant="light" value={false}>Confirmed</ToggleButton>
      <ToggleButton variant="light" value={true}>Estimated</ToggleButton>
    </ToggleButtonGroup>
  );
};
ConfirmedEstdToggle.propTypes = {
  showEstimated: PropTypes.bool.isRequired,
  onToggleChange: PropTypes.func.isRequired,
};

export const RecentCasesMap = (props) => {
  const {
    mapType,
    cases,
    population,
    dates,
    onCountryChange,
  } = props;
  const offset = 7 * 4;
  const startDate = new Date(dates[dates.length - offset - 8]);
  const endDate = new Date(dates[dates.length - offset - 1]);
  const format = Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const colorMap = colorMapFactory(
    (name) => (name in cases
      ? confirmedRecentCasesPer100K(cases[name], population[name], offset)
      : NaN),
    confirmedCasesColor,
    defaultConfirmedCasesColor,
  );
  return (
    <Card className="mt-4">
      <Card.Header>
        New Covid-19 cases per 100K population&nbsp;
        {format.format(startDate)}
        &nbsp;through&nbsp;
        {format.format(endDate)}
      </Card.Header>
      <Card.Body>
        <Map mapType={mapType} colorMap={colorMap} onCountryChange={onCountryChange} />
        <Legend colorArray={Array.from(confirmedCasesColors)} />
      </Card.Body>
    </Card>
  );
};

RecentCasesMap.propTypes = {
  mapType: propTypeMap.isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  population: PropTypes.objectOf(PropTypes.number).isRequired,
  dates: PropTypes.arrayOf(PropTypes.date).isRequired,
  onCountryChange: PropTypes.func.isRequired,
};
