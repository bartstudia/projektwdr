import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminReservations from './AdminReservations';
import reservationService from '../../services/reservationService';
import lakeService from '../../services/lakeService';

jest.mock('../../services/reservationService');
jest.mock('../../services/lakeService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('AdminReservations actions', () => {
  beforeEach(() => {
    reservationService.getAllReservations.mockReset();
    reservationService.cancelReservation.mockReset();
    lakeService.getAllLakes.mockReset();
  });

  it('cancels reservation from admin list', async () => {
    lakeService.getAllLakes.mockResolvedValue({ lakes: [] });
    reservationService.getAllReservations.mockResolvedValue({
      reservations: [
        {
          _id: '1',
          status: 'confirmed',
          userId: { name: 'User', email: 'user@test.pl' },
          lakeId: { name: 'Lake', location: 'Loc' },
          spotId: { name: 'Spot' },
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          notes: ''
        }
      ]
    });
    reservationService.cancelReservation.mockResolvedValue({ success: true });
    window.confirm = jest.fn(() => true);

    render(
      <MemoryRouter>
        <AdminReservations />
      </MemoryRouter>
    );

    expect(await screen.findByText('Wszystkie Rezerwacje')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Anuluj'));
    });

    await waitFor(() => {
      expect(reservationService.cancelReservation).toHaveBeenCalledWith('1');
    });
  });
});
