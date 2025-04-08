const React = require('react');
const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const RecruiterDashboard = require('../RecruiterDashboard');

// Mock para la imagen del logo
jest.mock('../../assets/lti-logo.png', () => 'ruta-mock-logo');

// Componente envuelto en BrowserRouter para permitir el uso de Link
const RenderWithRouter = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Pruebas del componente RecruiterDashboard', () => {
  it('debería renderizar el título correctamente', () => {
    render(
      <RenderWithRouter>
        <RecruiterDashboard />
      </RenderWithRouter>
    );
    
    // Verificar que el título está presente
    expect(screen.getByText('Dashboard del Reclutador')).toBeInTheDocument();
  });

  it('debería renderizar el botón de añadir candidato', () => {
    render(
      <RenderWithRouter>
        <RecruiterDashboard />
      </RenderWithRouter>
    );
    
    // Verificar que el botón está presente
    expect(screen.getByText('Añadir Nuevo Candidato')).toBeInTheDocument();
  });

  it('debería tener un enlace al formulario de añadir candidato', () => {
    render(
      <RenderWithRouter>
        <RecruiterDashboard />
      </RenderWithRouter>
    );
    
    // Verificar que existe un enlace con ruta a /add-candidate
    const addButton = screen.getByText('Añadir Nuevo Candidato');
    const linkElement = addButton.closest('a');
    expect(linkElement).toHaveAttribute('href', '/add-candidate');
  });

  it('debería mostrar el logo de LTI', () => {
    render(
      <RenderWithRouter>
        <RecruiterDashboard />
      </RenderWithRouter>
    );
    
    // Verificar que la imagen del logo está presente
    const logoElement = screen.getByAltText('LTI Logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', 'ruta-mock-logo');
  });
}); 