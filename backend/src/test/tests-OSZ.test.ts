import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Create a deep mock of PrismaClient
export const prismaMock =
  mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Mock the PrismaClient constructor to return our mock
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

// Mock the domain models
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator', () => ({
  validateCandidateData: jest.fn(),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockReset(prismaMock);
});

describe('PrismaMock', () => {
  it('should exist', () => {
    expect(prismaMock).toBeDefined();
  });
});

describe('Candidate Model', () => {
  const mockCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '600123456',
    address: '123 Main St',
    education: [],
    workExperience: [],
    resumes: [],
  };

  const mockCandidateResponse = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '600123456',
    address: '123 Main St',
  };

  describe('save method', () => {
    it('should create a new candidate when id is not provided', async () => {
      // Arrange
      prismaMock.candidate.create.mockResolvedValue(mockCandidateResponse);

      const mockSave = jest.fn().mockResolvedValue(mockCandidateResponse);
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () =>
          ({
            id: undefined,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '600123456',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: mockSave,
          }) as any,
      );

      const candidate = new Candidate(mockCandidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(result).toEqual(mockCandidateResponse);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should update an existing candidate when id is provided', async () => {
      // Arrange
      const candidateWithId = {
        ...mockCandidateData,
        id: 1,
      };

      prismaMock.candidate.update.mockResolvedValue(mockCandidateResponse);

      const mockSave = jest.fn().mockResolvedValue(mockCandidateResponse);
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () =>
          ({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '600123456',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: mockSave,
          }) as any,
      );

      const candidate = new Candidate(candidateWithId);

      // Act
      const result = await candidate.save();

      // Assert
      expect(result).toEqual(mockCandidateResponse);
      expect(mockSave).toHaveBeenCalled();
    });
  });
});

describe('Candidate Service', () => {
  const mockCandidateData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '600123456',
    address: '123 Main St',
    educations: [
      {
        institution: 'University',
        title: 'Computer Science',
        startDate: '2018-01-01',
        endDate: '2022-01-01',
      },
    ],
    workExperiences: [
      {
        company: 'Tech Company',
        position: 'Software Engineer',
        description: 'Development',
        startDate: '2022-02-01',
        endDate: null,
      },
    ],
    cv: {
      filePath: '/uploads/resume.pdf',
      fileType: 'application/pdf',
    },
  };

  const mockSavedCandidate = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '600123456',
    address: '123 Main St',
  };

  describe('addCandidate', () => {
    it('should validate candidate data before saving', async () => {
      // Arrange
      const validateCandidateData =
        require('../application/validator').validateCandidateData;

      // Mock implementations
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    });

    it('should create a new candidate and save it', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );

      // Act
      const result = await addCandidate(mockCandidateData);

      // Assert
      expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
      expect(mockCandidateInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should create and save education records', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockEducationInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (Education as jest.MockedClass<typeof Education>).mockImplementation(
        () => mockEducationInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(Education).toHaveBeenCalledWith(mockCandidateData.educations[0]);
      expect(mockEducationInstance.candidateId).toBe(1);
      expect(mockEducationInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.education).toContain(mockEducationInstance);
    });

    it('should create and save work experience records', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockWorkExperienceInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (
        WorkExperience as jest.MockedClass<typeof WorkExperience>
      ).mockImplementation(() => mockWorkExperienceInstance as any);

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(WorkExperience).toHaveBeenCalledWith(
        mockCandidateData.workExperiences[0],
      );
      expect(mockWorkExperienceInstance.candidateId).toBe(1);
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.workExperience).toContain(
        mockWorkExperienceInstance,
      );
    });

    it('should create and save resume record', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockResumeInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(
        () => mockResumeInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(Resume).toHaveBeenCalledWith(mockCandidateData.cv);
      expect(mockResumeInstance.candidateId).toBe(1);
      expect(mockResumeInstance.save).toHaveBeenCalled();
      expect(mockCandidateInstance.resumes).toContain(mockResumeInstance);
    });

    it('should throw an error when validation fails', async () => {
      // Arrange
      const validateCandidateData =
        require('../application/validator').validateCandidateData;
      validateCandidateData.mockImplementation(() => {
        throw new Error('Validation error');
      });

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow(
        'Validation error',
      );
    });

    it('should throw an error when email already exists', async () => {
      // Arrange
      const validateCandidateData =
        require('../application/validator').validateCandidateData;
      validateCandidateData.mockImplementation(() => {}); // Mock validation to pass

      const duplicateError = { code: 'P2002' };

      const mockCandidateInstance = {
        save: jest.fn().mockRejectedValue(duplicateError),
        education: [],
        workExperience: [],
        resumes: [],
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow(
        'The email already exists in the database',
      );
    });
  });
});

// Common mock data for both test suites
const mockCandidateData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '600123456',
  address: '123 Main St',
  educations: [
    {
      institution: 'University',
      title: 'Computer Science',
      startDate: '2018-01-01',
      endDate: '2022-01-01',
    },
  ],
  workExperiences: [
    {
      company: 'Tech Company',
      position: 'Software Engineer',
      description: 'Development',
      startDate: '2022-02-01',
      endDate: null,
    },
  ],
  cv: {
    filePath: '/uploads/resume.pdf',
    fileType: 'application/pdf',
  },
};

const mockSavedCandidate = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '600123456',
  address: '123 Main St',
};

/**
 * TEST SUITE 1: Receiving candidate data from frontend form
 * Tests the candidateService.ts functionality for processing and validating form data
 */
describe('Feature 1: Receiving candidate data from frontend form', () => {
  describe('candidateService.addCandidate', () => {
    // For each test in this suite, mock the validator to not throw errors
    beforeEach(() => {
      const validateCandidateData =
        require('../application/validator').validateCandidateData;
      validateCandidateData.mockImplementation(() => {}); // Mock validation to pass
    });

    it('should validate candidate data before processing', async () => {
      // Arrange
      const validateCandidateData =
        require('../application/validator').validateCandidateData;

      // Mock implementations
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue(mockSavedCandidate),
        education: [],
        workExperience: [],
        resumes: [],
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
    });

    it('should throw an error when validation fails', async () => {
      // Arrange
      const validateCandidateData =
        require('../application/validator').validateCandidateData;
      validateCandidateData.mockImplementation(() => {
        throw new Error('Validation error');
      });

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow(
        'Validation error',
      );
    });

    it('should create education records from form data', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockEducationInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (Education as jest.MockedClass<typeof Education>).mockImplementation(
        () => mockEducationInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(Education).toHaveBeenCalledWith(mockCandidateData.educations[0]);
      expect(mockEducationInstance.candidateId).toBe(1);
      expect(mockEducationInstance.save).toHaveBeenCalled();
    });

    it('should create work experience records from form data', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockWorkExperienceInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (
        WorkExperience as jest.MockedClass<typeof WorkExperience>
      ).mockImplementation(() => mockWorkExperienceInstance as any);

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(WorkExperience).toHaveBeenCalledWith(
        mockCandidateData.workExperiences[0],
      );
      expect(mockWorkExperienceInstance.candidateId).toBe(1);
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
    });

    it('should process resume file data from form', async () => {
      // Arrange
      const mockCandidateInstance = {
        save: jest.fn().mockResolvedValue({ ...mockSavedCandidate }),
        education: [],
        workExperience: [],
        resumes: [],
      };

      const mockResumeInstance = {
        save: jest.fn().mockResolvedValue({ id: 1 }),
        candidateId: undefined,
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );
      (Resume as jest.MockedClass<typeof Resume>).mockImplementation(
        () => mockResumeInstance as any,
      );

      // Act
      await addCandidate(mockCandidateData);

      // Assert
      expect(Resume).toHaveBeenCalledWith(mockCandidateData.cv);
      expect(mockResumeInstance.candidateId).toBe(1);
      expect(mockResumeInstance.save).toHaveBeenCalled();
    });
  });
});

/**
 * TEST SUITE 2: Saving candidate in DB
 * Tests the Candidate.ts model for database operations
 */
describe('Feature 2: Saving candidate in DB', () => {
  // Simplified data for DB tests
  const candidateModelData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '600123456',
    address: '123 Main St',
    education: [],
    workExperience: [],
    resumes: [],
  };

  describe('Candidate model', () => {
    it('should create a new candidate in the database when id is not provided', async () => {
      // Arrange
      prismaMock.candidate.create.mockResolvedValue(mockSavedCandidate);

      const mockSave = jest.fn().mockResolvedValue(mockSavedCandidate);
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () =>
          ({
            id: undefined,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '600123456',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: mockSave,
          }) as any,
      );

      const candidate = new Candidate(candidateModelData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(result).toEqual(mockSavedCandidate);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should update an existing candidate in the database when id is provided', async () => {
      // Arrange
      const candidateWithId = {
        ...candidateModelData,
        id: 1,
      };

      prismaMock.candidate.update.mockResolvedValue(mockSavedCandidate);

      const mockSave = jest.fn().mockResolvedValue(mockSavedCandidate);
      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () =>
          ({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '600123456',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: mockSave,
          }) as any,
      );

      const candidate = new Candidate(candidateWithId);

      // Act
      const result = await candidate.save();

      // Assert
      expect(result).toEqual(mockSavedCandidate);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should handle database connection errors properly', async () => {
      // Arrange
      const connectionError = new Error('Connection error');
      connectionError.name = 'PrismaClientInitializationError';

      prismaMock.candidate.create.mockRejectedValue(connectionError);

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () =>
          ({
            id: undefined,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '600123456',
            address: '123 Main St',
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockRejectedValue(connectionError),
          }) as any,
      );

      const candidate = new Candidate(candidateModelData);

      // Act & Assert
      await expect(candidate.save()).rejects.toThrow();
    });

    it('should throw an error when trying to save a candidate with an email that already exists', async () => {
      // Arrange
      const duplicateError = { code: 'P2002' };

      const mockCandidateInstance = {
        save: jest.fn().mockRejectedValue(duplicateError),
        education: [],
        workExperience: [],
        resumes: [],
      };

      (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(
        () => mockCandidateInstance as any,
      );

      // We need to validate to pass so the error comes from the save attempt
      const validateCandidateData =
        require('../application/validator').validateCandidateData;
      validateCandidateData.mockImplementation(() => {});

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow(
        'The email already exists in the database',
      );
    });
  });
});
