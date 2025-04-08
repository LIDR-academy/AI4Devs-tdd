import React, { useState } from 'react';

/**
 * Componente de formulario simple para demostración de pruebas
 */
const SimpleForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!name.trim() || !email.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un email válido');
      return;
    }
    
    // Limpiar error si todo está bien
    setError('');
    
    // Llamar al callback de onSubmit con los datos
    onSubmit({ name, email });
    
    // Limpiar el formulario
    setName('');
    setEmail('');
  };

  return (
    <div className="simple-form">
      <h2>Formulario de Contacto</h2>
      
      {error && <div className="error-message" data-testid="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="name-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
          />
        </div>
        
        <button type="submit" data-testid="submit-button">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default SimpleForm; 