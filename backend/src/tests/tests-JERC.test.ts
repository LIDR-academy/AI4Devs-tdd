import { PrismaClient } from '@prisma/client';
import { Candidate } from '../domain/models/Candidate';
import { addCandidate } from '../application/services/candidateService';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { setPrismaInstance } from '../domain/models/Candidate';

// Mock de Prisma
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindUnique = jest.fn();

const mockPrismaClient = {
  candidate: {
    create: mockCreate,
    update: mockUpdate,
    findUnique: mockFindUnique
  }
} as any;

describe('Candidate Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPrismaInstance(mockPrismaClient);
  });

  describe('Candidate Creation', () => {
    it('debería crear un candidato con datos básicos correctamente', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '666777888'
      };

      const mockSavedCandidate = { id: 1, ...candidateData };
      mockCreate.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);
      expect(result).toEqual(mockSavedCandidate);
      expect(mockCreate).toHaveBeenCalledWith({
        data: candidateData
      });
    });

    it('debería crear un candidato con educación', async () => {
      const candidateData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        educations: [{
          institution: 'Universidad de Madrid',
          title: 'Ingeniería Informática',
          startDate: '2020-09-01',
          endDate: '2024-06-30'
        }]
      };

      const mockSavedCandidate = { 
        id: 1, 
        ...candidateData,
        educations: [{
          id: 1,
          candidateId: 1,
          ...candidateData.educations[0]
        }]
      };

      mockCreate.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('debería crear un candidato con experiencia laboral', async () => {
      const candidateData = {
        firstName: 'Pedro',
        lastName: 'Sánchez',
        email: 'pedro@example.com',
        workExperiences: [{
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2020-01-01',
          endDate: '2023-12-31'
        }]
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        workExperiences: [{
          id: 1,
          candidateId: 1,
          ...candidateData.workExperiences[0]
        }]
      };

      mockCreate.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('debería crear un candidato con CV', async () => {
      const candidateData = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana@example.com',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        resumes: [{
          id: 1,
          candidateId: 1,
          ...candidateData.cv,
          uploadDate: expect.any(Date)
        }]
      };

      mockCreate.mockResolvedValue(mockSavedCandidate);

      const result = await addCandidate(candidateData);
      expect(result).toEqual(mockSavedCandidate);
    });
  });

  describe('Validaciones', () => {
    it('debería fallar si el nombre no es válido', async () => {
      const candidateData = {
        firstName: '123', // Nombre inválido
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });

    it('debería fallar si el email no es válido', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'email-invalido'
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
    });

    it('debería fallar si el teléfono no es válido', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '123' // Teléfono inválido
      };

      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid phone');
    });
  });

  describe('Errores de Base de Datos', () => {
    it('debería manejar error de conexión a base de datos', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      mockCreate.mockRejectedValue(
        new Error('No se pudo conectar con la base de datos')
      );

      await expect(addCandidate(candidateData)).rejects.toThrow(
        'No se pudo conectar con la base de datos'
      );
    });

    it('debería manejar error de email duplicado', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      mockCreate.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on the fields: (`email`)'
      });

      await expect(addCandidate(candidateData)).rejects.toThrow(
        'The email already exists in the database'
      );
    });
  });
});
