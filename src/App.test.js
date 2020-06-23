import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders current situation card', () => {
  const { getByText } = render(<App />);
  const currentSituation = getByText(/Current situation/i);
  expect(currentSituation).toBeInTheDocument();
});

test('renders outlook card', () => {
  const { getByText } = render(<App />);
  const outlook = getByText(/Current situation/i);
  expect(outlook).toBeInTheDocument();
});
