import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Prisma, PrismaClient } from '@prisma/client';

// Mocks
jest.mock('../application/services/candidateService');
jest.mock('../domain/models/Candidate');

// Interfaces para objetos de prueba
interface MockEducation {
  institution: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface MockWorkExperience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface MockResume {
  filePath: string;
  fileType: string;
}

// Mock de Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientInitializationError: jest.fn().mockImplementation(() => {
        const error = new Error('Prisma Initialization Error');
        return error;
      }),
      PrismaClientKnownRequestError: jest.fn().mockImplementation((message: string, meta: { code: string, clientVersion: string }) => {
        const error = new Error(message);
        Object.defineProperty(error, 'code', { value: meta.code });
        return error;
      })
    }
  };
});

describe('Suite de pruebas para gestión de candidatos', () => {
  // Pruebas para el Controlador
  describe('CandidateController - addCandidateController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockAddCandidate: jest.Mock;

    beforeEach(() => {
      mockRequest = {
        body: {
          firstName: 'Albert',
          lastName: 'Saelices',
          email: 'albert.saelices@gmail.com',
          phone: '656874937',
          address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
          educations: [
            {
              institution: 'UC3M',
              title: 'Computer Science',
              startDate: '2006-12-31',
              endDate: '2010-12-26'
            }
          ],
          workExperiences: [
            {
              company: 'Coca Cola',
              position: 'SWE',
              description: '',
              startDate: '2011-01-13',
              endDate: '2013-01-17'
            }
          ],
          cv: {
            filePath: 'uploads/1715760936750-cv.pdf',
            fileType: 'application/pdf'
          }
        }
      };

      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      mockAddCandidate = addCandidate as jest.Mock;
      mockAddCandidate.mockReset();
    });

    test('debería responder con estado 201 cuando se añade un candidato correctamente', async () => {
      // Arrange
      const candidatoCreado = { id: 1, ...mockRequest.body };
      mockAddCandidate.mockResolvedValue(candidatoCreado);

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: candidatoCreado
      });
    });

    test('debería responder con estado 400 cuando hay un error de validación', async () => {
      // Arrange
      const errorMessage = 'El campo firstName es obligatorio';
      mockAddCandidate.mockRejectedValue(new Error(errorMessage));

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockAddCandidate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: errorMessage
      });
    });

    test('debería manejar errores desconocidos correctamente', async () => {
      // Arrange
      mockAddCandidate.mockRejectedValue('Error desconocido');

      // Act
      await addCandidateController(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });
  });

  // Pruebas para el Servicio
  describe('CandidateService - addCandidate', () => {
    let mockCandidate: jest.Mock;
    let mockSave: jest.Mock;
    let candidatoValido: any;

    beforeEach(() => {
      mockSave = jest.fn();
      mockCandidate = Candidate as unknown as jest.Mock;
      mockCandidate.mockImplementation(() => ({
        id: undefined,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: [],
        workExperience: [],
        resumes: [],
        save: mockSave
      }));

      candidatoValido = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [
          {
            institution: 'UC3M',
            title: 'Computer Science',
            startDate: '2006-12-31',
            endDate: '2010-12-26'
          }
        ],
        workExperiences: [
          {
            company: 'Coca Cola',
            position: 'SWE',
            description: '',
            startDate: '2011-01-13',
            endDate: '2013-01-17'
          }
        ],
        cv: {
          filePath: 'uploads/1715760936750-cv.pdf',
          fileType: 'application/pdf'
        }
      };
    });

    test('debería crear un candidato correctamente cuando todos los datos son válidos', async () => {
      // Arrange
      const candidatoGuardado = { id: 1, ...candidatoValido };
      mockSave.mockResolvedValue(candidatoGuardado);

      // Act
      const resultado = await addCandidate(candidatoValido);

      // Assert
      expect(mockCandidate).toHaveBeenCalledWith(candidatoValido);
      expect(mockSave).toHaveBeenCalled();
      expect(resultado).toEqual(candidatoGuardado);
    });

    test('debería lanzar error cuando hay email duplicado', async () => {
      // Arrange
      const errorDuplicado = new Error('The email already exists in the database');
      Object.defineProperty(errorDuplicado, 'code', { value: 'P2002' });
      mockSave.mockRejectedValue(errorDuplicado);

      // Act & Assert
      await expect(addCandidate(candidatoValido)).rejects.toThrow('The email already exists in the database');
    });

    test('debería lanzar error cuando faltan campos obligatorios (firstName)', async () => {
      // Arrange
      const datosInvalidos = { ...candidatoValido, firstName: '' };

      // Act & Assert
      await expect(addCandidate(datosInvalidos)).rejects.toThrow();
    });

    test('debería lanzar error cuando faltan campos obligatorios (lastName)', async () => {
      // Arrange
      const datosInvalidos = { ...candidatoValido, lastName: '' };

      // Act & Assert
      await expect(addCandidate(datosInvalidos)).rejects.toThrow();
    });

    test('debería lanzar error cuando faltan campos obligatorios (email)', async () => {
      // Arrange
      const datosInvalidos = { ...candidatoValido, email: '' };

      // Act & Assert
      await expect(addCandidate(datosInvalidos)).rejects.toThrow();
    });

    test('debería lanzar error cuando el formato de email es inválido', async () => {
      // Arrange
      const datosInvalidos = { ...candidatoValido, email: 'correo-invalido' };

      // Act & Assert
      await expect(addCandidate(datosInvalidos)).rejects.toThrow();
    });

    test('debería aceptar un candidato sin educations', async () => {
      // Arrange
      const candidatoSinEducacion = { ...candidatoValido, educations: [] };
      const candidatoGuardado = { id: 1, ...candidatoSinEducacion };
      mockSave.mockResolvedValue(candidatoGuardado);

      // Act
      const resultado = await addCandidate(candidatoSinEducacion);

      // Assert
      expect(mockCandidate).toHaveBeenCalledWith(candidatoSinEducacion);
      expect(resultado).toEqual(candidatoGuardado);
    });

    test('debería aceptar un candidato sin workExperiences', async () => {
      // Arrange
      const candidatoSinExperiencia = { ...candidatoValido, workExperiences: [] };
      const candidatoGuardado = { id: 1, ...candidatoSinExperiencia };
      mockSave.mockResolvedValue(candidatoGuardado);

      // Act
      const resultado = await addCandidate(candidatoSinExperiencia);

      // Assert
      expect(mockCandidate).toHaveBeenCalledWith(candidatoSinExperiencia);
      expect(resultado).toEqual(candidatoGuardado);
    });

    test('debería aceptar un candidato sin CV', async () => {
      // Arrange
      const candidatoSinCV = { ...candidatoValido, cv: null };
      const candidatoGuardado = { id: 1, ...candidatoSinCV };
      mockSave.mockResolvedValue(candidatoGuardado);

      // Act
      const resultado = await addCandidate(candidatoSinCV);

      // Assert
      expect(mockCandidate).toHaveBeenCalledWith(candidatoSinCV);
      expect(resultado).toEqual(candidatoGuardado);
    });

    test('debería manejar errores de conexión a la base de datos', async () => {
      // Arrange
      const dbError = new Error('Prisma Initialization Error');
      mockSave.mockRejectedValue(dbError);

      // Act & Assert
      await expect(addCandidate(candidatoValido)).rejects.toThrow();
    });
  });

  // Pruebas para el Modelo/Repositorio
  describe('Candidate Model - save method', () => {
    let prismaClientMock: any;
    let candidate: Candidate;
    let candidateData: any;

    beforeEach(() => {
      prismaClientMock = new PrismaClient();
      
      candidateData = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        education: [],
        workExperience: [],
        resumes: []
      };
      
      candidate = new Candidate(candidateData);
      jest.clearAllMocks();
    });

    test('debería crear un nuevo candidato cuando no tiene ID', async () => {
      // Arrange
      const expectedResult = { id: 1, ...candidateData };
      prismaClientMock.candidate.create.mockResolvedValue(expectedResult);

      // Act
      const result = await candidate.save();

      // Assert
      expect(prismaClientMock.candidate.create).toHaveBeenCalled();
      expect(prismaClientMock.candidate.update).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    test('debería actualizar un candidato existente cuando tiene ID', async () => {
      // Arrange
      const existingCandidate = { ...candidateData, id: 1 };
      candidate = new Candidate(existingCandidate);
      prismaClientMock.candidate.update.mockResolvedValue(existingCandidate);

      // Act
      const result = await candidate.save();

      // Assert
      expect(prismaClientMock.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.any(Object)
      });
      expect(prismaClientMock.candidate.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingCandidate);
    });

    test('debería incluir educations al crear un candidato', async () => {
      // Arrange
      const educationData: MockEducation = {
        institution: 'UC3M',
        title: 'Computer Science',
        startDate: '2006-12-31',
        endDate: '2010-12-26'
      };
      candidate.education = [educationData as any];
      prismaClientMock.candidate.create.mockResolvedValue({ id: 1, ...candidateData });

      // Act
      await candidate.save();

      // Assert
      expect(prismaClientMock.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          educations: {
            create: [educationData]
          }
        })
      });
    });

    test('debería incluir workExperiences al crear un candidato', async () => {
      // Arrange
      const workExperienceData: MockWorkExperience = {
        company: 'Coca Cola',
        position: 'SWE',
        description: '',
        startDate: '2011-01-13',
        endDate: '2013-01-17'
      };
      candidate.workExperience = [workExperienceData as any];
      prismaClientMock.candidate.create.mockResolvedValue({ id: 1, ...candidateData });

      // Act
      await candidate.save();

      // Assert
      expect(prismaClientMock.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          workExperiences: {
            create: [workExperienceData]
          }
        })
      });
    });

    test('debería incluir resumes al crear un candidato', async () => {
      // Arrange
      const resumeData: MockResume = {
        filePath: 'uploads/1715760936750-cv.pdf',
        fileType: 'application/pdf'
      };
      candidate.resumes = [resumeData as any];
      prismaClientMock.candidate.create.mockResolvedValue({ id: 1, ...candidateData });

      // Act
      await candidate.save();

      // Assert
      expect(prismaClientMock.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resumes: {
            create: [resumeData]
          }
        })
      });
    });

    test('debería manejar errores de conexión a la base de datos al crear', async () => {
      // Arrange
      const dbError = new Error('Prisma Initialization Error');
      prismaClientMock.candidate.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos');
    });

    test('debería manejar errores de registro no encontrado al actualizar', async () => {
      // Arrange
      const existingCandidate = { ...candidateData, id: 1 };
      candidate = new Candidate(existingCandidate);
      
      const notFoundError = new Error('Record not found');
      Object.defineProperty(notFoundError, 'code', { value: 'P2025' });
      prismaClientMock.candidate.update.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro');
    });

    test('debería manejar errores de clave única (email duplicado)', async () => {
      // Arrange
      const uniqueConstraintError = new Error('Unique constraint failed');
      Object.defineProperty(uniqueConstraintError, 'code', { value: 'P2002' });
      prismaClientMock.candidate.create.mockRejectedValue(uniqueConstraintError);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow();
    });
  });

  // Tests de integración para la validación de datos
  describe('Validación de datos de candidato', () => {
    test('debería validar correctamente todos los campos obligatorios', async () => {
      // Arrange
      const candidatoValido = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [
          {
            institution: 'UC3M',
            title: 'Computer Science',
            startDate: '2006-12-31',
            endDate: '2010-12-26'
          }
        ],
        workExperiences: [
          {
            company: 'Coca Cola',
            position: 'SWE',
            description: '',
            startDate: '2011-01-13',
            endDate: '2013-01-17'
          }
        ],
        cv: {
          filePath: 'uploads/1715760936750-cv.pdf',
          fileType: 'application/pdf'
        }
      };
      
      const mockSave = jest.fn().mockResolvedValue({ id: 1, ...candidatoValido });
      jest.spyOn(Candidate.prototype, 'save').mockImplementation(mockSave);

      // Act
      const resultado = await addCandidate(candidatoValido);

      // Assert
      expect(resultado).toHaveProperty('id');
      expect(mockSave).toHaveBeenCalled();
    });

    test('debería rechazar un candidato con formato de email inválido', async () => {
      // Arrange
      const candidatoInvalido = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'correo-invalido',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [],
        workExperiences: [],
        cv: null
      };

      // Act & Assert
      await expect(addCandidate(candidatoInvalido)).rejects.toThrow();
    });

    test('debería rechazar un candidato con formato de teléfono inválido', async () => {
      // Arrange
      const candidatoInvalido = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: 'teléfono-inválido',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [],
        workExperiences: [],
        cv: null
      };

      // Act & Assert
      await expect(addCandidate(candidatoInvalido)).rejects.toThrow();
    });

    test('debería validar correctamente las fechas en educations', async () => {
      // Arrange
      const candidatoFechasInvalidas = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [
          {
            institution: 'UC3M',
            title: 'Computer Science',
            startDate: 'fecha-inválida',
            endDate: '2010-12-26'
          }
        ],
        workExperiences: [],
        cv: null
      };

      // Act & Assert
      await expect(addCandidate(candidatoFechasInvalidas)).rejects.toThrow();
    });

    test('debería validar correctamente las fechas en workExperiences', async () => {
      // Arrange
      const candidatoFechasInvalidas = {
        firstName: 'Albert',
        lastName: 'Saelices',
        email: 'albert.saelices@gmail.com',
        phone: '656874937',
        address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        educations: [],
        workExperiences: [
          {
            company: 'Coca Cola',
            position: 'SWE',
            description: '',
            startDate: '2011-01-13',
            endDate: 'fecha-inválida'
          }
        ],
        cv: null
      };

      // Act & Assert
      await expect(addCandidate(candidatoFechasInvalidas)).rejects.toThrow();
    });
  });
}); 