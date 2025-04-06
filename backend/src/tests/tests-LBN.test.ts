import { describe, expect, test } from '@jest/globals';
import { validateCandidateData } from '../application/validator';

/**
 * Tests para la funcionalidad LBN
 */
describe('Tests de validación (validator.ts)', () => {
  // Test para datos válidos
  test('Debería validar correctamente los datos completos de un candidato', () => {
    // Arrange
    const validData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Ejemplo 123',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniería Informática',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2023-01-31'
        }
      ],
      cv: {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf'
      }
    };
    
    // Act & Assert
    expect(() => validateCandidateData(validData)).not.toThrow();
  });

  // Test para validación de nombre
  test('Debería lanzar error cuando el nombre es inválido', () => {
    // Arrange
    const invalidData = {
      firstName: '', // Nombre vacío
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Act & Assert
    expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
  });

  // Test para validación de email
  test('Debería lanzar error cuando el email es inválido', () => {
    // Arrange
    const invalidData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'correo-invalido', // Email sin formato correcto
      phone: '612345678'
    };
    
    // Act & Assert
    expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
  });

  // Test para validación de teléfono
  test('Debería lanzar error cuando el teléfono es inválido', () => {
    // Arrange
    const invalidData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '1234' // Teléfono con formato incorrecto
    };
    
    // Act & Assert
    expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
  });

  // Test para validación de fecha
  test('Debería lanzar error cuando la fecha de educación es inválida', () => {
    // Arrange
    const invalidData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniería Informática',
          startDate: '01/09/2015', // Formato de fecha incorrecto
          endDate: '2019-06-30'
        }
      ]
    };
    
    // Act & Assert
    expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
  });

  // Test para caso límite: longitud máxima de campos
  test('Debería lanzar error cuando la longitud de un campo excede el máximo permitido', () => {
    // Arrange
    const longString = 'A'.repeat(101); // 101 caracteres, excede el límite de 100
    const invalidData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: longString
    };
    
    // Act & Assert
    expect(() => validateCandidateData(invalidData)).toThrow('Invalid address');
  });
}); 