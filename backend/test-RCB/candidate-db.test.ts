/**
 * @jest-environment node
 */

// Primera importación tiene que ser el mock
jest.mock('@prisma/client', () => {
  const createMock = jest.fn().mockResolvedValue({
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com'
  });
  
  const updateMock = jest.fn().mockResolvedValue({
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com'
  });
  
  const findUniqueMock = jest.fn().mockResolvedValue({
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com'
  });

  // Crear una clase de error personalizada para simular PrismaClientInitializationError
  class PrismaClientInitializationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'PrismaClientInitializationError';
    }
  }

  return {
    PrismaClient: jest.fn(() => ({
      candidate: {
        create: createMock,
        update: updateMock,
        findUnique: findUniqueMock
      }
    })),
    Prisma: {
      PrismaClientInitializationError
    }
  };
});

// Importaciones después de los mocks
import { Candidate } from '../src/domain/models/Candidate';
import { PrismaClient } from '@prisma/client';

// Obtenemos acceso a los mocks para poder modificar su comportamiento
const prisma = new PrismaClient();
const mockCreate = prisma.candidate.create as jest.Mock;
const mockUpdate = prisma.candidate.update as jest.Mock;
const mockFindUnique = prisma.candidate.findUnique as jest.Mock;

// Definimos una clase de error personalizada para las pruebas
class CustomPrismaClientInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaClientInitializationError';
  }
}

describe('Candidate - Guardado en la base de datos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe crear un candidato correctamente', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    // Act
    const candidate = new Candidate(candidateData);
    const result = await candidate.save();
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.firstName).toBe('Juan');
    expect(result.lastName).toBe('Pérez');
    expect(result.email).toBe('juan.perez@example.com');
  });

  test('Debe actualizar un candidato existente', async () => {
    // Arrange
    const candidateData = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez Actualizado',
      email: 'juan.perez.nuevo@example.com'
    };
    
    // Act
    const candidate = new Candidate(candidateData);
    const result = await candidate.save();
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  test('Debe crear un candidato con educación', async () => {
    // Arrange
    const today = new Date();
    const pastDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      education: [{
        institution: 'Universidad Complutense',
        title: 'Ingeniería Informática',
        startDate: pastDate,
        endDate: today
      }]
    };
    
    // Act
    const candidate = new Candidate(candidateData);
    const result = await candidate.save();
    
    // Assert
    expect(result).toBeDefined();
  });

  test('Debe crear un candidato con experiencia laboral', async () => {
    // Arrange
    const today = new Date();
    const pastDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      workExperience: [{
        company: 'Tech Solutions Inc.',
        position: 'Desarrollador Full Stack',
        description: 'Desarrollo de aplicaciones web',
        startDate: pastDate,
        endDate: today
      }]
    };
    
    // Act
    const candidate = new Candidate(candidateData);
    const result = await candidate.save();
    
    // Assert
    expect(result).toBeDefined();
  });

  test('Debe crear un candidato con resumen', async () => {
    // Arrange
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      resumes: [{
        filePath: '/uploads/resumes/juan_perez_cv.pdf',
        fileType: 'application/pdf'
      }]
    };
    
    // Act
    const candidate = new Candidate(candidateData);
    const result = await candidate.save();
    
    // Assert
    expect(result).toBeDefined();
  });

  test('Debe manejar errores de conexión a la base de datos al crear', async () => {
    // Arrange
    const error = new Error('No se pudo conectar con la base de datos');
    error.name = 'PrismaClientInitializationError';
    mockCreate.mockRejectedValueOnce(error);

    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos');
  });

  test('Debe manejar errores de conexión a la base de datos al actualizar', async () => {
    // Arrange
    const error = new Error('No se pudo conectar con la base de datos');
    error.name = 'PrismaClientInitializationError';
    mockUpdate.mockRejectedValueOnce(error);

    const candidateData = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos');
  });

  test('Debe manejar errores de conexión usando la clase de error personalizada', async () => {
    // Arrange
    const initError = new CustomPrismaClientInitializationError('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
    mockCreate.mockRejectedValueOnce(initError);

    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos');
  });

  test('Debe manejar errores de registro no encontrado', async () => {
    // Arrange
    const error = {
      code: 'P2025',
      message: 'Record to update not found.'
    };
    mockUpdate.mockRejectedValueOnce(error);

    const candidateData = {
      id: 999, // ID que no existe
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro del candidato');
  });

  test('Debe manejar otros tipos de errores al actualizar', async () => {
    // Arrange
    const error = new Error('Error desconocido');
    mockUpdate.mockRejectedValueOnce(error);

    const candidateData = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('Error desconocido');
  });

  test('Debe manejar otros tipos de errores al crear', async () => {
    // Arrange
    const error = new Error('Error desconocido');
    mockCreate.mockRejectedValueOnce(error);

    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };
    
    const candidate = new Candidate(candidateData);
    
    // Act & Assert
    await expect(candidate.save()).rejects.toThrow('Error desconocido');
  });

  test('Debe buscar un candidato por su ID', async () => {
    // Act
    const candidate = await Candidate.findOne(1);
    
    // Assert
    expect(candidate).not.toBeNull();
    expect(candidate?.id).toBe(1);
    expect(candidate?.firstName).toBe('Juan');
    expect(candidate?.lastName).toBe('Pérez');
    expect(candidate?.email).toBe('juan.perez@example.com');
  });

  test('Debe devolver null si no encuentra el candidato', async () => {
    // Arrange
    mockFindUnique.mockResolvedValueOnce(null);
    
    // Act
    const candidate = await Candidate.findOne(999);
    
    // Assert
    expect(candidate).toBeNull();
  });
}); 