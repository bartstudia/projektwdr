import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LakesPage from './LakesPage';
import lakeService from '../../services/lakeService';

jest.mock('../../services/lakeService');
jest.mock('../../services/reservationService', () => ({
  getReservedSpotsForDate: jest.fn()
}));

describe('LakesPage sorting', () => {
  beforeEach(() => {
    lakeService.getAllLakes.mockReset();
  });

  it('sorts lakes by name descending', async () => {
    lakeService.getAllLakes.mockResolvedValue({
      lakes: [
        { _id: '1', name: 'Alpha', location: 'Mazury', isActive: true, description: 'A' },
        { _id: '2', name: 'Beta', location: 'Pomorze', isActive: true, description: 'B' }
      ]
    });

    render(
      <MemoryRouter>
        <LakesPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();

    const sortSelect = screen.getByLabelText('Sortowanie:');
    fireEvent.change(sortSelect, { target: { value: 'name-desc' } });

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('Beta');
    expect(headings[1]).toHaveTextContent('Alpha');
  });
});
