import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

// Mock del servicio de candidatos
jest.mock('../application/services/candidateService');

describe('Tests para controladores (candidateController.ts)', () => {
  // Configuración de mocks para Request y Response
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();

    // Crear mocks para los métodos de respuesta
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    
    // Configurar objetos req y res
    req = {
      body: {},
    };
    
    res = {
      status: statusMock,
      json: jsonMock
    };
  });

  // Test para respuesta exitosa al crear candidato
  test('Debería responder con status 201 al crear un candidato correctamente', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const mockResult = { 
      id: 1, 
      ...candidateData 
    };
    
    req.body = candidateData;
    
    // Mock de la función addCandidate para que devuelva un resultado exitoso
    (candidateService.addCandidate as jest.Mock).mockResolvedValue(mockResult);

    // Act
    await addCandidateController(req as Request, res as Response);

    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ 
      message: 'Candidate added successfully', 
      data: mockResult 
    });
  });

  // Test para respuesta de error cuando los datos son inválidos
  test('Debería responder con status 400 cuando hay un error en los datos', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      // email faltante (obligatorio)
    };
    
    req.body = candidateData;
    
    // Mock para simular un error en la validación
    const validationError = new Error('Invalid email');
    (candidateService.addCandidate as jest.Mock).mockRejectedValue(validationError);

    // Act
    await addCandidateController(req as Request, res as Response);

    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ 
      message: 'Error adding candidate', 
      error: 'Invalid email' 
    });
  });

  // Test para manejo de errores inesperados
  test('Debería manejar errores desconocidos correctamente', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    req.body = candidateData;
    
    // Simulamos un error que no es una instancia de Error
    (candidateService.addCandidate as jest.Mock).mockRejectedValue('Unknown error');

    // Act
    await addCandidateController(req as Request, res as Response);

    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ 
      message: 'Error adding candidate', 
      error: 'Unknown error' 
    });
  });

  // Test para caso donde el servicio devuelve un error de duplicación de email
  test('Debería manejar error de email duplicado', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'duplicado@example.com'
    };
    
    req.body = candidateData;
    
    // Mock para simular error de email duplicado
    const duplicateError = new Error('The email already exists in the database');
    (candidateService.addCandidate as jest.Mock).mockRejectedValue(duplicateError);

    // Act
    await addCandidateController(req as Request, res as Response);

    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ 
      message: 'Error adding candidate', 
      error: 'The email already exists in the database' 
    });
  });

  // Test para verificar el manejo de datos vacíos
  test('Debería manejar petición con cuerpo vacío', async () => {
    // Arrange
    req.body = {};
    
    // Mock para simular error por datos vacíos
    const emptyDataError = new Error('Missing required fields');
    (candidateService.addCandidate as jest.Mock).mockRejectedValue(emptyDataError);

    // Act
    await addCandidateController(req as Request, res as Response);

    // Assert
    expect(candidateService.addCandidate).toHaveBeenCalledWith({});
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ 
      message: 'Error adding candidate', 
      error: 'Missing required fields' 
    });
  });
}); 