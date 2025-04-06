import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecruiterDashboard from '../RecruiterDashboard';

// Mock the image import
jest.mock('../../assets/lti-logo.png', () => 'mocked-logo.png');

const renderWithRouter = (component) => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {component}
    </BrowserRouter>
  );
};

describe('RecruiterDashboard Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<RecruiterDashboard />);
    expect(screen.getByText(/Dashboard del Reclutador/i)).toBeInTheDocument();
  });

  it('displays the main sections', () => {
    renderWithRouter(<RecruiterDashboard />);
    
    // Check for main sections
    expect(screen.getByText(/Añadir Nuevo Candidato/i)).toBeInTheDocument();
    expect(screen.getByAltText(/LTI Logo/i)).toBeInTheDocument();
  });
}); 