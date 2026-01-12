import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import adminService from '../../services/adminService';

jest.mock('../../services/adminService');
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Admin' } })
}));

const renderDashboard = () => {
  render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
};

describe('AdminDashboard stats', () => {
  beforeEach(() => {
    adminService.getStats.mockReset();
  });

  it('renders stats from api', async () => {
    adminService.getStats.mockResolvedValue({
      stats: {
        lakesCount: 3,
        spotsCount: 12,
        activeReservations: 5,
        newReviews: 2
      }
    });

    renderDashboard();

    expect(await screen.findByText('3')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders error when api fails', async () => {
    adminService.getStats.mockRejectedValue({
      message: 'Blad pobierania'
    });

    renderDashboard();

    expect(await screen.findByText('Blad pobierania')).toBeInTheDocument();
  });
});
