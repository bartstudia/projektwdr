import React from 'react';
import { render, screen } from '@testing-library/react';
import LakeForm from './LakeForm';

jest.mock('../../services/lakeService', () => ({
  createLake: jest.fn(),
  updateLake: jest.fn(),
  uploadImage: jest.fn()
}));

describe('LakeForm optional fields', () => {
  it('renders optional lake fields', () => {
    render(<LakeForm lake={null} onSuccess={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText(/Regulamin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/20/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kontakt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  });
});
