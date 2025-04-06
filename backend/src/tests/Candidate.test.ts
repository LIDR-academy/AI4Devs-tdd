import { Candidate } from '../domain/models/Candidate';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('Candidate Model', () => {
  let prismaClient: any;

  beforeEach(() => {
    // Get the mocked PrismaClient instance
    prismaClient = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new candidate instance with basic properties', () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate.firstName).toBe('John');
      expect(candidate.lastName).toBe('Doe');
      expect(candidate.email).toBe('john.doe@example.com');
      expect(candidate.phone).toBe('1234567890');
      expect(candidate.address).toBe('123 Main St');
    });

    it('should initialize candidate with empty arrays for related entities', () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    it('should initialize with provided arrays for related entities', () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        education: [{ id: 1, title: 'CS Degree' }],
        workExperience: [{ id: 1, company: 'Tech Co' }],
        resumes: [{ id: 1, filePath: '/path/to/resume.pdf' }],
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate.education).toEqual([{ id: 1, title: 'CS Degree' }]);
      expect(candidate.workExperience).toEqual([{ id: 1, company: 'Tech Co' }]);
      expect(candidate.resumes).toEqual([
        { id: 1, filePath: '/path/to/resume.pdf' },
      ]);
    });
  });

  describe('save method', () => {
    it('should call prisma create when id is not provided', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockCreatedCandidate = {
        id: 1,
        ...candidateData,
      };

      prismaClient.candidate.create.mockResolvedValue(mockCreatedCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(prismaClient.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining(candidateData),
      });
      expect(result).toEqual(mockCreatedCandidate);
    });

    it('should call prisma update when id is provided', async () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockUpdatedCandidate = {
        ...candidateData,
      };

      prismaClient.candidate.update.mockResolvedValue(mockUpdatedCandidate);

      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(prismaClient.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        }),
      });
      expect(result).toEqual(mockUpdatedCandidate);
    });

    it('should handle errors during save operation', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      prismaClient.candidate.create.mockRejectedValue(
        new Error('Some error occurred'),
      );

      const candidate = new Candidate(candidateData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow();
    });
  });

  describe('findOne method', () => {
    it('should find a candidate by ID', async () => {
      // Arrange
      const mockCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      prismaClient.candidate.findUnique.mockResolvedValue(mockCandidate);

      // Act
      const result = await Candidate.findOne(1);

      // Assert
      expect(prismaClient.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.id).toBe(1);
      expect(result?.firstName).toBe('John');
    });

    it('should return null when candidate is not found', async () => {
      // Arrange
      prismaClient.candidate.findUnique.mockResolvedValue(null);

      // Act
      const result = await Candidate.findOne(999);

      // Assert
      expect(prismaClient.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });

    it('should handle errors during findOne operation', async () => {
      // Arrange
      const errorMessage = 'Database connection error';
      prismaClient.candidate.findUnique.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(Candidate.findOne(1)).rejects.toThrow(errorMessage);
    });
  });
});
