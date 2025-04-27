import { PrismaClient, Prisma } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { addCandidate } from '../../../application/services/candidateService';
import { validateCandidateData } from '../../../application/validator';

// Create a custom error type with a code property for Prisma errors
interface PrismaError extends Error {
  code?: string;
}

// Mock the necessary modules and PrismaClient
jest.mock('../../../application/validator');
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      ...jest.requireActual('@prisma/client').Prisma
    }
  };
});

// Create a mock PrismaClient
const mockPrismaClient = mockDeep<PrismaClient>();

// Mock the domain models
jest.mock('../../../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation((data) => {
      return {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        education: [],
        workExperience: [],
        resumes: [],
        save: jest.fn().mockImplementation(async () => {
          if (data.id === 999) {
            const error = new Error('Record not found') as PrismaError;
            error.code = 'P2025';
            throw error;
          } else if (data.email === 'duplicate@example.com') {
            const error = new Error('Unique constraint failed on the fields: (`email`)') as PrismaError;
            error.code = 'P2002';
            throw error;
          }
          // Return only the basic candidate fields, not including related data
          return {
            id: data.id || 1,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address
          };
        })
      };
    })
  };
});

jest.mock('../../../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

jest.mock('../../../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

jest.mock('../../../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

describe('Candidate Service', () => {
  // Test data
  const mockCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    address: 'Test Address',
    educations: [
      {
        institution: 'University A',
        title: 'Computer Science',
        startDate: '2015-01-01',
        endDate: '2019-01-01'
      }
    ],
    workExperiences: [
      {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2019-02-01',
        endDate: '2022-01-01',
        description: 'Worked as a developer'
      }
    ],
    cv: {
      filePath: '/uploads/resume.pdf',
      fileType: 'application/pdf'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should create a new candidate with all related data', async () => {
    // Arrange - no additional arrangement needed, mocks are set up

    // Act
    const result = await addCandidate(mockCandidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    expect(result).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      address: 'Test Address'
    });
  });
  
  test('should create a candidate without optional data (no educations, workExperiences or CV)', async () => {
    // Arrange
    const simpleCandidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321'
    };

    // Act
    const result = await addCandidate(simpleCandidateData);

    // Assert
    expect(validateCandidateData).toHaveBeenCalledWith(simpleCandidateData);
    expect(result).toEqual({
      id: 1,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321',
      address: undefined
    });
  });

  test('should throw validation error when data is invalid', async () => {
    // Arrange
    const validationError = new Error('Invalid email format');
    (validateCandidateData as jest.Mock).mockImplementationOnce(() => {
      throw validationError;
    });

    // Act & Assert
    await expect(addCandidate(mockCandidateData)).rejects.toThrow('Error: Invalid email format');
    expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
  });

  test('should handle non-existent candidate when updating', async () => {
    // Arrange
    const nonExistentCandidateData = {
      ...mockCandidateData,
      id: 999 // This ID triggers the P2025 error in our mock
    };

    // Act & Assert
    await expect(addCandidate(nonExistentCandidateData)).rejects.toThrow('Record not found');
    expect(validateCandidateData).toHaveBeenCalledWith(nonExistentCandidateData);
  });

  test('should handle unique constraint violation on email', async () => {
    // Arrange
    const duplicateEmailData = {
      ...mockCandidateData,
      email: 'duplicate@example.com' // This email triggers the P2002 error in our mock
    };

    // Act & Assert
    await expect(addCandidate(duplicateEmailData)).rejects.toThrow('The email already exists in the database');
    expect(validateCandidateData).toHaveBeenCalledWith(duplicateEmailData);
  });

  test('should propagate other errors from the model', async () => {
    // Arrange
    const { Candidate } = require('../../../domain/models/Candidate');
    const unexpectedError = new Error('Unexpected database error');
    (Candidate as jest.Mock).mockImplementationOnce(() => {
      return {
        id: undefined,
        firstName: mockCandidateData.firstName,
        lastName: mockCandidateData.lastName,
        email: mockCandidateData.email,
        education: [],
        workExperience: [],
        resumes: [],
        save: jest.fn().mockRejectedValue(unexpectedError)
      };
    });

    // Act & Assert
    await expect(addCandidate(mockCandidateData)).rejects.toThrow('Unexpected database error');
    expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
  });
});
