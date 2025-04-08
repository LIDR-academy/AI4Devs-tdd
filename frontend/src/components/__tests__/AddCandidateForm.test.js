import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCandidateForm from '../AddCandidateForm';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the FileUploader component
jest.mock('../FileUploader', () => {
  return function MockFileUploader({ onChange, onUpload }) {
    return (
      <div data-testid="mock-file-uploader">
        <input
          type="file"
          aria-label="CV"
          onChange={(e) => {
            const file = e.target.files[0];
            onChange(file);
            onUpload({ filePath: 'test.pdf', fileType: 'application/pdf' });
          }}
        />
      </div>
    );
  };
});

describe('AddCandidateForm Component', () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('renders without crashing', () => {
    render(<AddCandidateForm />);
    expect(screen.getByText(/Agregar Candidato/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<AddCandidateForm />);
    
    // Check for basic form fields
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CV/i)).toBeInTheDocument();
    
    // Check for section buttons
    expect(screen.getByText(/Añadir Educación/i)).toBeInTheDocument();
    expect(screen.getByText(/Añadir Experiencia Laboral/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AddCandidateForm />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText(/Enviar/i));
    
    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/Error al añadir candidato/i)).toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 201,
      ok: true
    });

    render(<AddCandidateForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: '123 Main St' } });
    
    // Add education
    fireEvent.click(screen.getByText(/Añadir Educación/i));
    fireEvent.change(screen.getByPlaceholderText(/Institución/i), { target: { value: 'University' } });
    fireEvent.change(screen.getByPlaceholderText(/Título/i), { target: { value: 'Computer Science' } });
    
    // Add work experience
    fireEvent.click(screen.getByText(/Añadir Experiencia Laboral/i));
    fireEvent.change(screen.getByPlaceholderText(/Empresa/i), { target: { value: 'Tech Corp' } });
    fireEvent.change(screen.getByPlaceholderText(/Puesto/i), { target: { value: 'Software Engineer' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Candidato añadido con éxito/i)).toBeInTheDocument();
    });
  });

  it('handles server error', async () => {
    global.fetch.mockResolvedValueOnce({
      status: 500,
      ok: false
    });

    render(<AddCandidateForm />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'john.doe@example.com' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Enviar/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Error interno del servidor/i)).toBeInTheDocument();
    });
  });

  it('handles adding and removing sections', async () => {
    render(<AddCandidateForm />);
    
    // Add education section
    fireEvent.click(screen.getByText(/Añadir Educación/i));
    expect(screen.getByPlaceholderText(/Institución/i)).toBeInTheDocument();
    
    // Remove education section
    const deleteButtons = await screen.findAllByText(/Eliminar/i);
    fireEvent.click(deleteButtons[0]);
    expect(screen.queryByPlaceholderText(/Institución/i)).not.toBeInTheDocument();
    
    // Add work experience section
    fireEvent.click(screen.getByText(/Añadir Experiencia Laboral/i));
    expect(screen.getByPlaceholderText(/Empresa/i)).toBeInTheDocument();
    
    // Remove work experience section
    const updatedDeleteButtons = await screen.findAllByText(/Eliminar/i);
    fireEvent.click(updatedDeleteButtons[0]);
    expect(screen.queryByPlaceholderText(/Empresa/i)).not.toBeInTheDocument();
  });
}); 