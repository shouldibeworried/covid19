import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

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

export const Map = (props) => {
  const { mapType } = props;
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
              geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
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
};
