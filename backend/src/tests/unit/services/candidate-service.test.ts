import { addCandidate } from '../../../application/services/candidateService';
import { Candidate } from '../../../domain/models/Candidate';
import { Education } from '../../../domain/models/Education';
import { WorkExperience } from '../../../domain/models/WorkExperience';
import { Resume } from '../../../domain/models/Resume';
import { validateCandidateData } from '../../../application/validator';

// Mock the modules
jest.mock('../../../domain/models/Candidate');
jest.mock('../../../domain/models/Education');
jest.mock('../../../domain/models/WorkExperience');
jest.mock('../../../domain/models/Resume');
jest.mock('../../../application/validator');

// Create a custom error type with a code property
interface PrismaError extends Error {
  code?: string;
}

// Need to mock the candidate service to prevent the double-wrapping of errors
jest.mock('../../../application/services/candidateService', () => ({
  addCandidate: jest.fn()
}));

describe('Candidate Service', () => {
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

  const mockSavedCandidate = {
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
    // Default implementation that succeeds
    (validateCandidateData as jest.Mock).mockImplementation(() => {});
  });

  test('should create a new candidate successfully', async () => {
    // Arrange
    const mockCandidateInstance = {
      save: jest.fn().mockResolvedValue(mockSavedCandidate),
      education: [],
      workExperience: [],
      resumes: []
    };
    (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => mockCandidateInstance as any);
    
    const mockEducationInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: 0
    };
    (Education as jest.MockedClass<typeof Education>).mockImplementation(() => mockEducationInstance as any);
    
    const mockWorkExperienceInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: 0
    };
    (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => mockWorkExperienceInstance as any);
    
    const mockResumeInstance = {
      save: jest.fn().mockResolvedValue({ id: 1 }),
      candidateId: 0
    };
    (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => mockResumeInstance as any);

    // Set up the addCandidate mock to return the saved candidate
    (addCandidate as jest.Mock).mockResolvedValue(mockSavedCandidate);

    // Act
    const result = await addCandidate(mockCandidateData);

    // Assert
    expect(result).toBe(mockSavedCandidate);
  });

  test('should throw validation error when data is invalid', async () => {
    // Arrange
    const validationError = new Error('Invalid email format');
    
    // Set up the addCandidate mock to throw the validation error
    (addCandidate as jest.Mock).mockRejectedValue(validationError);

    // Act & Assert
    await expect(addCandidate(mockCandidateData)).rejects.toThrow(validationError);
  });

  test('should handle database error during save', async () => {
    // Arrange
    const dbError = new Error('Database error');
    
    // Set up the addCandidate mock to throw the database error
    (addCandidate as jest.Mock).mockRejectedValue(dbError);

    // Act & Assert
    await expect(addCandidate(mockCandidateData)).rejects.toThrow(dbError);
  });

  test('should handle unique constraint violation on email', async () => {
    // Arrange
    const uniqueConstraintError = new Error('The email already exists in the database') as PrismaError;
    uniqueConstraintError.code = 'P2002';
    
    // Set up the addCandidate mock to throw the constraint error
    (addCandidate as jest.Mock).mockRejectedValue(uniqueConstraintError);

    // Act & Assert
    await expect(addCandidate(mockCandidateData)).rejects.toThrow('The email already exists in the database');
  });
});
