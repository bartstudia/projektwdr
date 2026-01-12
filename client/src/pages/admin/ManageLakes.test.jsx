import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageLakes from './ManageLakes';
import lakeService from '../../services/lakeService';

jest.mock('../../services/lakeService');

const renderManageLakes = async (lakes) => {
  lakeService.getAllLakes.mockResolvedValue({ lakes });
  render(
    <MemoryRouter>
      <ManageLakes />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Zarządzanie Jeziorami/i)).toBeInTheDocument();
};

describe('ManageLakes filters', () => {
  const lakes = [
    { _id: '1', name: 'Jezioro Active', location: 'Mazury', isActive: true },
    { _id: '2', name: 'Jezioro Inactive', location: 'Pomorze', isActive: false }
  ];

  beforeEach(() => {
    lakeService.getAllLakes.mockReset();
  });

  it('filters lakes by status', async () => {
    await renderManageLakes(lakes);
    expect(screen.getByText('Jezioro Active')).toBeInTheDocument();
    expect(screen.getByText('Jezioro Inactive')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: 'inactive' }
    });

    expect(screen.queryByText('Jezioro Active')).not.toBeInTheDocument();
    expect(screen.getByText('Jezioro Inactive')).toBeInTheDocument();
  });

  it('filters lakes by search term', async () => {
    await renderManageLakes(lakes);

    fireEvent.change(screen.getByLabelText(/Szukaj/i), {
      target: { value: 'Mazury' }
    });

    expect(screen.getByText('Jezioro Active')).toBeInTheDocument();
    expect(screen.queryByText('Jezioro Inactive')).not.toBeInTheDocument();
  });
});
