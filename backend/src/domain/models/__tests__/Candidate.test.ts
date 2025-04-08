import { Candidate } from '../Candidate';
import { PrismaClient, Prisma } from '@prisma/client';

// Mock PrismaClient and Prisma namespace
jest.mock('@prisma/client', () => {
  class PrismaClientInitializationError extends Error {
    constructor(message: string, clientVersion: string) {
      super(message);
      this.name = 'PrismaClientInitializationError';
      this.clientVersion = clientVersion;
    }
    clientVersion: string;
  }

  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    }
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      PrismaClientInitializationError
    }
  };
});

describe('Candidate Model', () => {
  let prisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });

  describe('constructor', () => {
    it('should create a candidate instance with required fields', () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const candidate = new Candidate(candidateData);

      expect(candidate.firstName).toBe(candidateData.firstName);
      expect(candidate.lastName).toBe(candidateData.lastName);
      expect(candidate.email).toBe(candidateData.email);
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    it('should create a candidate instance with all fields', () => {
      const candidateData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
        education: [{ institution: 'University', title: 'Degree' }],
        workExperience: [{ company: 'Company', position: 'Developer' }],
        resumes: [{ filePath: 'path/to/file', fileType: 'application/pdf' }]
      };

      const candidate = new Candidate(candidateData);

      expect(candidate).toEqual(expect.objectContaining(candidateData));
    });
  });

  describe('save', () => {
    it('should create a new candidate when id is not provided', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const candidate = new Candidate(candidateData);
      const mockResult = { ...candidateData, id: 1 };
      prisma.candidate.create.mockImplementation(() => Promise.resolve(mockResult));

      const result = await candidate.save();

      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: candidateData
      });
      expect(result).toEqual(mockResult);
    });

    it('should update an existing candidate when id is provided', async () => {
      const candidateData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      const candidate = new Candidate(candidateData);
      prisma.candidate.update.mockImplementation(() => Promise.resolve(candidateData));

      const result = await candidate.save();

      expect(prisma.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        })
      });
      expect(result).toEqual(candidateData);
    });

    it('should handle database connection errors', async () => {
      const candidate = new Candidate({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });

      const error = new Prisma.PrismaClientInitializationError('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.', '5.10.0');
      prisma.candidate.create.mockImplementation(() => Promise.reject(error));

      await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
    });
  });

  describe('findOne', () => {
    it('should find a candidate by id', async () => {
      const candidateData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      prisma.candidate.findUnique.mockImplementation(() => Promise.resolve(candidateData));

      const result = await Candidate.findOne(1);

      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.firstName).toBe(candidateData.firstName);
    });

    it('should return null when candidate is not found', async () => {
      prisma.candidate.findUnique.mockImplementation(() => Promise.resolve(null));

      const result = await Candidate.findOne(1);

      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeNull();
    });
  });
}); 