import { PrismaClient, Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Create a mock PrismaClient with all methods mocked
const mockPrismaClient = mockDeep<PrismaClient>();

// Mock the @prisma/client module BEFORE importing Candidate
jest.mock('@prisma/client', () => {
  return {
    // Keep the actual Prisma namespace for errors
    Prisma: {
      ...jest.requireActual('@prisma/client').Prisma
    },
    // Return our mock client for PrismaClient constructor
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Now import Candidate - this will use our mocked PrismaClient
import { Candidate } from '../../../domain/models/Candidate';

describe('Candidate Model', () => {
  const mockCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    address: 'Test Address',
    education: [
      {
        institution: 'University A',
        title: 'Computer Science',
        startDate: new Date('2015-01-01'),
        endDate: new Date('2019-01-01')
      }
    ],
    workExperience: [
      {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: new Date('2019-02-01'),
        endDate: new Date('2022-01-01'),
        description: 'Worked as a developer'
      }
    ],
    resumes: [
      {
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf'
      }
    ]
  };

  const mockCandidateResponseData = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    address: 'Test Address',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    test('should create a new candidate when no ID is provided', async () => {
      // Arrange
      mockPrismaClient.candidate.create.mockResolvedValue(mockCandidateResponseData);

      const candidateModel = new Candidate(mockCandidateData);

      // Act
      const result = await candidateModel.save();

      // Assert
      expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: mockCandidateData.firstName,
          lastName: mockCandidateData.lastName,
          email: mockCandidateData.email,
          phone: mockCandidateData.phone
        })
      });
      expect(result).toEqual(mockCandidateResponseData);
    });

    test('should update an existing candidate when ID is provided', async () => {
      // Arrange
      const mockUpdateData = {
        ...mockCandidateData,
        id: 1
      };
      
      mockPrismaClient.candidate.update.mockResolvedValue({
        ...mockCandidateResponseData,
        firstName: 'John Updated'
      });

      const candidateModel = new Candidate(mockUpdateData);

      // Act
      const result = await candidateModel.save();

      // Assert
      expect(mockPrismaClient.candidate.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          firstName: mockUpdateData.firstName,
          lastName: mockUpdateData.lastName,
          email: mockUpdateData.email,
          phone: mockUpdateData.phone
        })
      });
      expect(result).toHaveProperty('firstName', 'John Updated');
    });

    test('should throw error when updating non-existent candidate', async () => {
      // Mock console.log to prevent actual logging during tests
      const originalConsoleLog = console.log;
      console.log = jest.fn();

      try {
        // Arrange
        const mockUpdateData = {
          ...mockCandidateData,
          id: 999 // Non-existent ID
        };

        const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Record not found',
          { 
            code: 'P2025',
            clientVersion: '4.0.0'
          }
        );
        mockPrismaClient.candidate.update.mockRejectedValue(prismaError);

        const candidateModel = new Candidate(mockUpdateData);

        // Act & Assert
        await expect(candidateModel.save()).rejects.toThrow('No se pudo encontrar el registro');
      } finally {
        // Restore original console.log
        console.log = originalConsoleLog;
      }
    });

    test('should throw error when database connection fails', async () => {
      // Mock console.log to prevent actual logging during tests
      const originalConsoleLog = console.log;
      console.log = jest.fn();
      
      try {
        // Arrange
        const mockUpdateData = {
          ...mockCandidateData,
          id: 1
        };

        const connectionError = new Prisma.PrismaClientInitializationError(
          'Connection failed',
          '4.0.0'
        );
        mockPrismaClient.candidate.update.mockRejectedValue(connectionError);

        const candidateModel = new Candidate(mockUpdateData);

        // Act & Assert
        await expect(candidateModel.save()).rejects.toThrow('No se pudo conectar con la base de datos');
      } finally {
        // Restore original console.log
        console.log = originalConsoleLog;
      }
    });
  });

  describe('findOne method', () => {
    test('should return candidate when found', async () => {
      // Arrange
      mockPrismaClient.candidate.findUnique.mockResolvedValue(mockCandidateResponseData);

      // Act
      const result = await Candidate.findOne(1);

      // Assert
      expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.firstName).toBe(mockCandidateResponseData.firstName);
    });

    test('should return null when candidate not found', async () => {
      // Arrange
      mockPrismaClient.candidate.findUnique.mockResolvedValue(null);

      // Act
      const result = await Candidate.findOne(999);

      // Assert
      expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      expect(result).toBeNull();
    });
  });
});
