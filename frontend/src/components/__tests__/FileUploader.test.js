import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUploader from '../FileUploader';

// Mock the fetch function
global.fetch = jest.fn();

describe('FileUploader Component', () => {
  const mockOnChange = jest.fn();
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnUpload.mockClear();
    global.fetch.mockClear();
  });

  it('renders without crashing', () => {
    render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
    expect(screen.getByText(/Subir Archivo/i)).toBeInTheDocument();
  });

  it('handles file selection correctly', () => {
    render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(mockOnChange).toHaveBeenCalledWith(file);
    expect(screen.getByText(/Selected file: test.pdf/)).toBeInTheDocument();
  });

  it('handles successful file upload', async () => {
    const mockResponse = { success: true, data: 'test data' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
    
    // Select a file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    // Click upload button
    const uploadButton = screen.getByText(/Subir Archivo/i);
    fireEvent.click(uploadButton);
    
    // Check loading state
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText(/Archivo subido con éxito/)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('handles upload error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<FileUploader onChange={mockOnChange} onUpload={mockOnUpload} />);
    
    // Select a file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/File/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    // Click upload button
    const uploadButton = screen.getByText(/Subir Archivo/i);
    fireEvent.click(uploadButton);
    
    // Wait for error handling
    await waitFor(() => {
      expect(mockOnUpload).not.toHaveBeenCalled();
    });
  });
}); 