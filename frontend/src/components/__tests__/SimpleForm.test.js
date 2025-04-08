const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const SimpleForm = require('../SimpleForm');

describe('Pruebas del componente SimpleForm', () => {
  // Mock de la función onSubmit
  const mockOnSubmit = jest.fn();

  // Antes de cada prueba, limpiamos los mocks
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('debería renderizar el formulario correctamente', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    // Verificar que los elementos del formulario están presentes
    expect(screen.getByText('Formulario de Contacto')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    
    // Verificar que el mensaje de error no está presente inicialmente
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('debería mostrar error cuando los campos están vacíos', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    // Simular envío del formulario sin rellenar campos
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Verificar que aparece el mensaje de error
    expect(screen.getByTestId('error-message')).toHaveTextContent('Todos los campos son obligatorios');
    
    // Verificar que no se llamó a onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debería mostrar error cuando el email no es válido', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    // Rellenar campos con email inválido
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'correo-invalido' } });
    
    // Simular envío del formulario
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Verificar que aparece el mensaje de error
    expect(screen.getByTestId('error-message')).toHaveTextContent('Por favor, introduce un email válido');
    
    // Verificar que no se llamó a onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debería enviar el formulario correctamente con datos válidos', async () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    // Datos de prueba
    const testName = 'María García';
    const testEmail = 'maria@ejemplo.com';
    
    // Rellenar campos con datos válidos
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: testName } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: testEmail } });
    
    // Simular envío del formulario
    fireEvent.click(screen.getByTestId('submit-button'));
    
    // Verificar que no hay mensaje de error
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    
    // Verificar que se llamó a onSubmit con los datos correctos
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: testName, email: testEmail });
    
    // Verificar que los campos se limpiaron después del envío
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
    });
  });

  it('debería actualizar el estado cuando se escriben valores en los inputs', () => {
    render(<SimpleForm onSubmit={mockOnSubmit} />);
    
    // Cambiar el valor del input de nombre
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Pedro' } });
    expect(screen.getByTestId('name-input')).toHaveValue('Pedro');
    
    // Cambiar el valor del input de email
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'pedro@test.com' } });
    expect(screen.getByTestId('email-input')).toHaveValue('pedro@test.com');
  });
}); 