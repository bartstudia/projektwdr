import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home hero content', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', {
      name: /System Rezerwacji Stanowisk Wędkarskich/i
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /Zarejestruj się/i })
  ).toBeInTheDocument();
});
