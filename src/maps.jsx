import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
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
  projectionConfig: { rotate: [-15.0, -52.0, 0], scale: 1000 },
};

export const colorMapFactory = (getValue, colorScale, defaultColor) => ((name) => {
  const value = getValue(name);
  return Number.isNaN(value) ? defaultColor : colorScale(value);
});


const Map = (props) => {
  const { mapType, colorMap } = props;
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
  colorArray: PropTypes.arrayOf(PropTypes.oneOfType(PropTypes.number, PropTypes.string)).isRequired,
};


export const R0Map = (props) => {
  const { mapType, cases } = props;
  const colorMap = colorMapFactory(
    (name) => (name in cases ? rNoughtWeeklyAverage(cases[name]) : NaN),
    r0Color,
    defaultR0Color,
  );
  return (
    <Col md>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>
            Basic Reproduction Factor
          </Card.Title>
          <Map mapType={mapType} colorMap={colorMap} />
          <Legend colorArray={Array.from(r0Colors)} />
        </Card.Body>
      </Card>
    </Col>
  );
};

R0Map.propTypes = {
  mapType: propTypeMap.isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
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

export class RecentCasesMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEstimated: false,
    };
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  handleToggleChange(showEstimated) {
    this.setState({ showEstimated });
  }

  render() {
    const {
      mapType,
      cases,
      deaths,
      population,
    } = this.props;
    const { showEstimated } = this.state;
    let colorMap;
    if (showEstimated) {
      colorMap = colorMapFactory(
        (name) => (name in cases
          ? estimatedRecentCasesPer100K(cases[name], deaths[name], population[name])
          : NaN),
        estimatedCasesColor,
        defaultEstimatedCasesColor,
      );
    } else {
      colorMap = colorMapFactory(
        (name) => (name in cases
          ? confirmedRecentCasesPer100K(cases[name], population[name])
          : NaN),
        confirmedCasesColor,
        defaultConfirmedCasesColor,
      );
    }
    return (
      <Col md>
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>
              Recent New Cases per 100K Population
            </Card.Title>
            <Map mapType={mapType} colorMap={colorMap} />
            <Legend colorArray={showEstimated
              ? Array.from(estimatedCasesColors)
              : Array.from(confirmedCasesColors)}
            />
            <ConfirmedEstdToggle
              showEstimated={showEstimated}
              onToggleChange={this.handleToggleChange}
            />
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

RecentCasesMap.propTypes = {
  mapType: propTypeMap.isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  deaths: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  population: PropTypes.objectOf(PropTypes.number).isRequired,
};
