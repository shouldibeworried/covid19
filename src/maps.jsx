import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import { rNoughtWeeklyAverage, confirmedRecentCasesPer100K } from './methodology';
import {
  r0Color,
  defaultR0Color,
  confirmedCasesColor,
  defaultConfirmedCasesColor,
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
    <Col md>
      <Card className="mt-4">
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
      </Card>
    </Col>
  );
};

Map.propTypes = {
  mapType: PropTypes.shape({
    geoUrl: PropTypes.string,
    projection: PropTypes.string,
    projectionConfig: PropTypes.shape({
      rotate: PropTypes.arrayOf(PropTypes.number),
      scale: PropTypes.number,
    }),
  }).isRequired,
  colorMap: PropTypes.func.isRequired,
};


export const R0Map = (props) => {
  const { mapType, cases } = props;
  const colorMap = colorMapFactory(
    (name) => (name in cases ?  rNoughtWeeklyAverage(cases[name]) : NaN),
    r0Color,
    defaultR0Color,
  );
  return <Map mapType={mapType} colorMap={colorMap} />;
};

R0Map.propTypes = {
  mapType: PropTypes.shape({
    geoUrl: PropTypes.string,
    projection: PropTypes.string,
    projectionConfig: PropTypes.shape({
      rotate: PropTypes.arrayOf(PropTypes.number),
      scale: PropTypes.number,
    }),
  }).isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

export const RecentCasesMap = (props) => {
  const { mapType, cases, population } = props;
  const colorMap = colorMapFactory(
    (name) => (name in cases ? confirmedRecentCasesPer100K(cases[name], population[name]) : NaN),
    confirmedCasesColor,
    defaultConfirmedCasesColor,
  );
  return <Map mapType={mapType} colorMap={colorMap} />;
};

RecentCasesMap.propTypes = {
  mapType: PropTypes.shape({
    geoUrl: PropTypes.string,
    projection: PropTypes.string,
    projectionConfig: PropTypes.shape({
      rotate: PropTypes.arrayOf(PropTypes.number),
      scale: PropTypes.number,
    }),
  }).isRequired,
  cases: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  population: PropTypes.objectOf(PropTypes.number).isRequired,
};
