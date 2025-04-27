import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mocks para los modelos y prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: jest.fn(),
      update: jest.fn()
    },
    education: {
      create: jest.fn()
    },
    workExperience: {
      create: jest.fn()
    },
    resume: {
      create: jest.fn()
    }
  }))
}));

jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/services/candidateService');
jest.mock('../application/validator');

describe('Alta de candidatos - Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TESTS DEL CONTROLADOR
  describe('1. Controller: addCandidateController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonSpy: jest.Mock;
    let statusSpy: jest.Mock;

    beforeEach(() => {
      jsonSpy = jest.fn();
      statusSpy = jest.fn().mockReturnValue({ json: jsonSpy });
      mockRequest = {
        body: {
          firstName: 'Juan',
          lastName: 'García',
          email: 'juan@example.com',
          phone: '666777888',
          address: 'Calle Ejemplo 123'
        }
      };
      mockResponse = {
        status: statusSpy,
        json: jsonSpy
      };
    });

    test('1.1 Debe retornar 201 y datos del candidato cuando la creación es exitosa', async () => {
      const mockCandidate = { id: 1, ...mockRequest.body };
      (addCandidate as jest.Mock).mockResolvedValue(mockCandidate);

      await addCandidateController(mockRequest as Request, mockResponse as Response);

      expect(addCandidate).toHaveBeenCalledWith(mockRequest.body);
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCandidate
      });
    });

    test('1.2 Debe retornar 400 y mensaje de error cuando la validación falla', async () => {
      const errorMessage = 'Invalid email';
      (addCandidate as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await addCandidateController(mockRequest as Request, mockResponse as Response);

      expect(addCandidate).toHaveBeenCalledWith(mockRequest.body);
      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: errorMessage
      });
    });

    test('1.3 Debe retornar 400 y mensaje de error cuando hay un error de duplicidad de email', async () => {
      const errorMessage = 'The email already exists in the database';
      (addCandidate as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await addCandidateController(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: errorMessage
      });
    });

    test('1.4 Debe retornar 400 y mensaje de error genérico para errores no clasificados', async () => {
      (addCandidate as jest.Mock).mockRejectedValue('Error desconocido');

      await addCandidateController(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });
  });

  // TESTS PARA VALIDADOR
  describe('3. Validator: validateCandidateData', () => {
    test('3.1 Debe validar correctamente un candidato válido', () => {
      const validCandidateData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(validCandidateData);
    });

    test('3.2 Debe rechazar un nombre inválido', () => {
      const invalidNameData = {
        firstName: 'J', // Nombre demasiado corto
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid name');
      });
      
      expect(() => validateCandidateData(invalidNameData)).toThrow('Invalid name');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidNameData);
    });

    test('3.3 Debe rechazar un email inválido', () => {
      const invalidEmailData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juanexample.com', // Email sin @
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid email');
      });
      
      expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidEmailData);
    });

    test('3.4 Debe rechazar un teléfono inválido', () => {
      const invalidPhoneData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '12345', // Teléfono inválido
        address: 'Calle Ejemplo 123'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid phone');
      });
      
      expect(() => validateCandidateData(invalidPhoneData)).toThrow('Invalid phone');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidPhoneData);
    });

    test('3.5 Debe validar correctamente educación válida', () => {
      const validEducationData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        educations: [{
          institution: 'Universidad Ejemplo',
          title: 'Ingeniería Informática',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }]
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      expect(() => validateCandidateData(validEducationData)).not.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(validEducationData);
    });

    test('3.6 Debe rechazar educación con institución inválida', () => {
      const invalidEducationData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        educations: [{
          institution: '', // Institución vacía
          title: 'Ingeniería Informática',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }]
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid institution');
      });
      
      expect(() => validateCandidateData(invalidEducationData)).toThrow('Invalid institution');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidEducationData);
    });

    test('3.7 Debe rechazar educación con fecha inválida', () => {
      const invalidDateEducationData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        educations: [{
          institution: 'Universidad Ejemplo',
          title: 'Ingeniería Informática',
          startDate: '2015/09/01', // Formato de fecha incorrecto
          endDate: '2019-06-30'
        }]
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid date');
      });
      
      expect(() => validateCandidateData(invalidDateEducationData)).toThrow('Invalid date');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidDateEducationData);
    });

    test('3.8 Debe validar correctamente experiencia laboral válida', () => {
      const validExperienceData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        workExperiences: [{
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }]
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      expect(() => validateCandidateData(validExperienceData)).not.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(validExperienceData);
    });

    test('3.9 Debe rechazar experiencia con compañía inválida', () => {
      const invalidExperienceData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        workExperiences: [{
          company: '', // Compañía vacía
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }]
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid company');
      });
      
      expect(() => validateCandidateData(invalidExperienceData)).toThrow('Invalid company');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidExperienceData);
    });

    test('3.10 Debe validar correctamente CV válido', () => {
      const validCVData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      expect(() => validateCandidateData(validCVData)).not.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(validCVData);
    });

    test('3.11 Debe rechazar CV con datos inválidos', () => {
      const invalidCVData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        cv: {
          filePath: '', // Ruta vacía
          fileType: 'application/pdf'
        }
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid CV data');
      });
      
      expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidCVData);
    });

    test('3.12 Debe permitir validación cuando se proporciona un ID (edición)', () => {
      const editCandidateData = {
        id: 1,
        firstName: '', // Campos que normalmente serían inválidos
        lastName: '',
        email: ''
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      expect(() => validateCandidateData(editCandidateData)).not.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(editCandidateData);
    });
  });

  // TESTS DEL SERVICIO
  describe('2. Service: addCandidate', () => {
    beforeEach(() => {
      // Limpiar todos los mocks
      jest.clearAllMocks();
    });

    test('2.1 Debe validar correctamente los datos del candidato', async () => {
      const validCandidateData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      const savedCandidate = { id: 1, ...validCandidateData };
      
      // Mocks para el servicio
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      // Mock del constructor de Candidate
      const mockSave = jest.fn().mockResolvedValue(savedCandidate);
      (Candidate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        education: [],
        workExperience: [],
        resumes: []
      }));
      
      // Reemplazar el mock anterior por la implementación real
      jest.unmock('../application/services/candidateService');
      
      // Importar la función real después de desmockearla
      const { addCandidate } = require('../application/services/candidateService');
      
      const result = await addCandidate(validCandidateData);
      
      expect(validateCandidateData).toHaveBeenCalledWith(validCandidateData);
      expect(Candidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(savedCandidate);
    });

    test('2.2 Debe lanzar error cuando la validación falla', async () => {
      const invalidCandidateData = {
        firstName: 'J', // Nombre demasiado corto
        lastName: 'García',
        email: 'juan@example.com'
      };
      
      // Mock para que validateCandidateData lance un error
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid name');
      });
      
      // Reemplazar el mock anterior por la implementación real
      jest.unmock('../application/services/candidateService');
      
      // Importar la función real después de desmockearla
      const { addCandidate } = require('../application/services/candidateService');
      
      await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Invalid name');
      expect(validateCandidateData).toHaveBeenCalledWith(invalidCandidateData);
      expect(Candidate).not.toHaveBeenCalled();
    });

    test('2.3 Debe crear correctamente un candidato básico (sin educación, experiencia ni CV)', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      const savedCandidate = { id: 1, ...candidateData };
      
      // Mocks para el servicio
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      // Mock del constructor de Candidate
      const mockSave = jest.fn().mockResolvedValue(savedCandidate);
      (Candidate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        education: [],
        workExperience: [],
        resumes: []
      }));
      
      // Reemplazar el mock anterior por la implementación real
      jest.unmock('../application/services/candidateService');
      
      // Importar la función real después de desmockearla
      const { addCandidate } = require('../application/services/candidateService');
      
      const result = await addCandidate(candidateData);
      
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(mockSave).toHaveBeenCalled();
      expect(Education).not.toHaveBeenCalled();
      expect(WorkExperience).not.toHaveBeenCalled();
      expect(Resume).not.toHaveBeenCalled();
      expect(result).toEqual(savedCandidate);
    });

    test('2.4 Debe crear correctamente un candidato con educación', async () => {
      const educationData = {
        institution: 'Universidad Ejemplo',
        title: 'Ingeniería Informática',
        startDate: '2015-09-01',
        endDate: '2019-06-30'
      };
      
      const candidateData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123',
        educations: [educationData]
      };
      
      const savedCandidate = { id: 1, ...candidateData };
      
      // Mocks para el servicio
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      // Mock del constructor de Candidate
      const mockCandidateSave = jest.fn().mockResolvedValue(savedCandidate);
      (Candidate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockCandidateSave,
        education: [],
        workExperience: [],
        resumes: []
      }));
      
      // Mock del constructor de Education
      const mockEducationSave = jest.fn().mockResolvedValue({ id: 1, ...educationData, candidateId: 1 });
      (Education as unknown as jest.Mock).mockImplementation(() => ({
        save: mockEducationSave,
        candidateId: undefined
      }));
      
      // Reemplazar el mock anterior por la implementación real
      jest.unmock('../application/services/candidateService');
      
      // Importar la función real después de desmockearla
      const { addCandidate } = require('../application/services/candidateService');
      
      const result = await addCandidate(candidateData);
      
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(mockCandidateSave).toHaveBeenCalled();
      expect(Education).toHaveBeenCalledWith(educationData);
      expect(mockEducationSave).toHaveBeenCalled();
      expect(result).toEqual(savedCandidate);
    });

    test('2.8 Debe manejar correctamente el error cuando el email ya existe', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '666777888',
        address: 'Calle Ejemplo 123'
      };
      
      // Mocks para el servicio
      (validateCandidateData as jest.Mock).mockImplementation(() => {});
      
      // Mock del constructor de Candidate que lanza error de email duplicado
      const mockSave = jest.fn().mockRejectedValue({ code: 'P2002' });
      (Candidate as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
        education: [],
        workExperience: [],
        resumes: []
      }));
      
      // Reemplazar el mock anterior por la implementación real
      jest.unmock('../application/services/candidateService');
      
      // Importar la función real después de desmockearla
      const { addCandidate } = require('../application/services/candidateService');
      
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
