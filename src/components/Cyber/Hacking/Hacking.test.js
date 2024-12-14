import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders welcome text', () => {
  const { getAllByText } = render(<App />);
  const welcomeText = getAllByText(/IEZ/); // Use getAllByText instead of getByText
  expect(welcomeText.length).toBeGreaterThan(0); // Check if there are multiple matching elements
});

test('renders canvas element', () => {
  const { getByTestId, debug } = render(<App />);
  debug(); // Output the rendered DOM structure for inspection
  const canvasElement = getByTestId('matrix');
  expect(canvasElement).toBeInTheDocument();
});

