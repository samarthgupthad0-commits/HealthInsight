import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the HealthInsight app', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /healthinsight/i });
  expect(heading).toBeInTheDocument();
});
