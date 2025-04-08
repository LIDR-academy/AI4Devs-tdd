import { addCandidate } from '../../../../src/application/services/candidateService';
import { Candidate } from '../../../../src/domain/models/Candidate';
import { Education } from '../../../../src/domain/models/Education';
import { WorkExperience } from '../../../../src/domain/models/WorkExperience';
import { Resume } from '../../../../src/domain/models/Resume';
import { Prisma } from '@prisma/client';

// Mock Prisma error
class MockPrismaClientInitializationError extends Error {
  clientVersion: string;
  
  constructor(message: string, options: { clientVersion: string }) {
    super(message);
    this.name = 'PrismaClientInitializationError';
    this.clientVersion = options.clientVersion;
  }
}

// Mock the Resume model
jest.mock('../../../../src/domain/models/Resume', () => {
  return {
    __esModule: true,
    Resume: class MockResume {
      filePath: string;
      fileType: string;
      uploadDate?: Date;
      candidateId?: number;

      constructor(data: any) {
        this.filePath = data.filePath;
        this.fileType = data.fileType;
        this.uploadDate = data.uploadDate || new Date();
        this.candidateId = data.candidateId;
      }

      async save() {
        return { 
          id: 1,
          filePath: this.filePath,
          fileType: this.fileType,
          uploadDate: this.uploadDate,
          candidateId: this.candidateId
        };
      }
    }
  };
});

// Mock the WorkExperience model
jest.mock('../../../../src/domain/models/WorkExperience', () => {
  return {
    __esModule: true,
    WorkExperience: class MockWorkExperience {
      company: string;
      position: string;
      description?: string;
      startDate: string;
      endDate?: string;
      candidateId?: number;

      constructor(data: any) {
        this.company = data.company;
        this.position = data.position;
        this.description = data.description;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.candidateId = data.candidateId;
      }

      async save() {
        return { 
          id: 1,
          company: this.company,
          position: this.position,
          description: this.description,
          startDate: this.startDate,
          endDate: this.endDate,
          candidateId: this.candidateId
        };
      }
    }
  };
});

// Mock the Education model
jest.mock('../../../../src/domain/models/Education', () => {
  return {
    __esModule: true,
    Education: class MockEducation {
      institution: string;
      title: string;
      startDate: string;
      endDate?: string;
      candidateId?: number;

      constructor(data: any) {
        this.institution = data.institution;
        this.title = data.title;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.candidateId = data.candidateId;
      }

      async save() {
        return { 
          id: 1,
          institution: this.institution,
          title: this.title,
          startDate: this.startDate,
          endDate: this.endDate,
          candidateId: this.candidateId
        };
      }
    }
  };
});

// Mock the database interactions
jest.mock('../../../../src/domain/models/Candidate', () => {
  const originalModule = jest.requireActual('../../../../src/domain/models/Candidate');
  
  return {
    __esModule: true,
    ...originalModule,
    Candidate: class MockCandidate {
      id?: number;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      address?: string;
      education: any[];
      workExperience: any[];
      resumes: any[];
      static shouldThrowDuplicateError = false;
      static shouldThrowConnectionError = false;

      constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.education = data.education || [];
        this.workExperience = data.workExperience || [];
        this.resumes = data.resumes || [];
      }

      async save() {
        // For duplicate email testing
        if (MockCandidate.shouldThrowDuplicateError) {
          const error: any = new Error('Unique constraint failed on the fields: (`email`)');
          error.code = 'P2002';
          throw error;
        }

        // For database connection error testing
        if (MockCandidate.shouldThrowConnectionError) {
          throw new MockPrismaClientInitializationError(
            'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.',
            { clientVersion: '5.1.1' }
          );
        }

        // Mock successful save operation
        return { 
          id: 1, 
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          address: this.address
        };
      }
    }
  };
});

describe('Candidate Service - Add Candidate', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the error flags
    jest.requireMock('../../../../src/domain/models/Candidate').Candidate.shouldThrowDuplicateError = false;
    jest.requireMock('../../../../src/domain/models/Candidate').Candidate.shouldThrowConnectionError = false;
  });
  
  describe('US1: Basic Candidate Insertion', () => {
    
    test('testAddCandidateWithBasicInfo', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.firstName).toBe(candidateData.firstName);
      expect(result.lastName).toBe(candidateData.lastName);
      expect(result.email).toBe(candidateData.email);
    });

    test('testAddCandidateWithInvalidFirstName', async () => {
      // Arrange
      const invalidFirstNameData = {
        firstName: '12345', // Invalid: contains numbers
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Act & Assert
      await expect(addCandidate(invalidFirstNameData)).rejects.toThrow('Invalid name');
    });

    test('testAddCandidateWithInvalidLastName', async () => {
      // Arrange
      const invalidLastNameData = {
        firstName: 'John',
        lastName: '', // Invalid: empty string
        email: 'john.doe@example.com'
      };

      // Act & Assert
      await expect(addCandidate(invalidLastNameData)).rejects.toThrow('Invalid name');
    });

    test('testAddCandidateWithInvalidEmail', async () => {
      // Arrange
      const invalidEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email' // Invalid: not an email format
      };

      // Act & Assert
      await expect(addCandidate(invalidEmailData)).rejects.toThrow('Invalid email');
    });
  });

  describe('US2: Candidate with Optional Information', () => {
    
    test('testAddCandidateWithValidOptionalInfo', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '612345678',
        address: 'Calle Mayor 1, Madrid'
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.firstName).toBe(candidateData.firstName);
      expect(result.lastName).toBe(candidateData.lastName);
      expect(result.email).toBe(candidateData.email);
      expect(result.phone).toBe(candidateData.phone);
      expect(result.address).toBe(candidateData.address);
    });

    test('testAddCandidateWithInvalidPhone', async () => {
      // Arrange
      const invalidPhoneData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567' // Invalid: doesn't match Spanish phone pattern
      };

      // Act & Assert
      await expect(addCandidate(invalidPhoneData)).rejects.toThrow('Invalid phone');
    });

    test('testAddCandidateWithInvalidAddress', async () => {
      // Arrange
      const veryLongAddress = 'A'.repeat(101); // 101 characters, exceeds 100 limit
      const invalidAddressData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        address: veryLongAddress
      };

      // Act & Assert
      await expect(addCandidate(invalidAddressData)).rejects.toThrow('Invalid address');
    });
  });

  describe('US3: Candidate with Education History', () => {
    
    test('testAddCandidateWithSingleEducation', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'University of Madrid',
            title: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-30'
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithMultipleEducations', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'University of Madrid',
            title: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-30'
          },
          {
            institution: 'Technical Institute',
            title: 'Web Development',
            startDate: '2019-01-15',
            endDate: '2019-12-20'
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithOngoingEducation', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'University of Madrid',
            title: 'Computer Science',
            startDate: '2020-09-01'
            // No end date for ongoing education
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithInvalidEducation', async () => {
      // Arrange - Missing institution
      const invalidEducationData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: '', // Invalid: empty institution
            title: 'Computer Science',
            startDate: '2020-09-01'
          }
        ]
      };

      // Act & Assert
      await expect(addCandidate(invalidEducationData)).rejects.toThrow('Invalid institution');
      
      // Arrange - Invalid date format
      const invalidDateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'University of Madrid',
            title: 'Computer Science',
            startDate: '2020/09/01' // Invalid format
          }
        ]
      };

      // Act & Assert
      await expect(addCandidate(invalidDateData)).rejects.toThrow('Invalid date');
    });
  });

  describe('US4: Candidate with Work Experience', () => {
    
    test('testAddCandidateWithSingleWorkExperience', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: 'Tech Solutions',
            position: 'Software Developer',
            description: 'Developed web applications',
            startDate: '2020-01-01',
            endDate: '2022-12-31'
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithMultipleWorkExperiences', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: 'Tech Solutions',
            position: 'Software Developer',
            description: 'Developed web applications',
            startDate: '2020-01-01',
            endDate: '2022-12-31'
          },
          {
            company: 'Digital Agency',
            position: 'Junior Developer',
            description: 'Frontend development',
            startDate: '2018-06-01',
            endDate: '2019-12-31'
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithCurrentJob', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: 'Tech Solutions',
            position: 'Software Developer',
            description: 'Developing web applications',
            startDate: '2020-01-01'
            // No end date for current job
          }
        ]
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithInvalidWorkExperience', async () => {
      // Arrange - Missing company
      const invalidCompanyData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: '', // Invalid: empty company
            position: 'Software Developer',
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      await expect(addCandidate(invalidCompanyData)).rejects.toThrow('Invalid company');
      
      // Arrange - Very long description
      const veryLongDescription = 'A'.repeat(201); // 201 characters, exceeds 200 limit
      const invalidDescriptionData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: 'Tech Solutions',
            position: 'Software Developer',
            description: veryLongDescription,
            startDate: '2020-01-01'
          }
        ]
      };

      // Act & Assert
      await expect(addCandidate(invalidDescriptionData)).rejects.toThrow('Invalid description');
    });
  });

  describe('US5: Candidate with Resume', () => {
    
    test('testAddCandidateWithResume', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {
          filePath: '/uploads/resumes/john-doe-cv.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date()
        }
      };

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('testAddCandidateWithInvalidResume', async () => {
      // Arrange - Missing file path
      const invalidResumeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {
          filePath: '', // Invalid: empty file path
          fileType: 'application/pdf'
        }
      };

      // Act & Assert
      await expect(addCandidate(invalidResumeData)).rejects.toThrow('Invalid CV data');
      
      // Arrange - Missing file type
      const invalidFileTypeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {
          filePath: '/uploads/resumes/john-doe-cv.pdf',
          fileType: null // Invalid: missing file type
        }
      };

      // Act & Assert
      await expect(addCandidate(invalidFileTypeData)).rejects.toThrow('Invalid CV data');
    });
  });

  describe('US6: Prevent Duplicate Candidates', () => {
    
    test('testAddCandidateWithDuplicateEmail', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Setup mock to throw duplicate email error
      jest.requireMock('../../../../src/domain/models/Candidate').Candidate.shouldThrowDuplicateError = true;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });
  });

  describe('US7: Handle Validation Errors', () => {
    
    test('testValidationErrorsAreReturned', async () => {
      // Test invalid first name
      await expect(addCandidate({
        firstName: '12345', // Invalid: contains numbers
        lastName: 'Doe',
        email: 'john.doe@example.com'
      })).rejects.toThrow('Invalid name');

      // Test invalid email
      await expect(addCandidate({
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email'
      })).rejects.toThrow('Invalid email');

      // Test invalid phone
      await expect(addCandidate({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123' // Too short
      })).rejects.toThrow('Invalid phone');

      // Test invalid education
      await expect(addCandidate({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [{ 
          institution: 'University',
          title: '', // Empty title
          startDate: '2020-01-01' 
        }]
      })).rejects.toThrow('Invalid title');

      // Test invalid work experience
      await expect(addCandidate({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [{ 
          company: 'Company',
          position: '', // Empty position
          startDate: '2020-01-01' 
        }]
      })).rejects.toThrow('Invalid position');
    });
  });

  describe('US8: Handle Database Connection Issues', () => {
    
    test('testDatabaseConnectionError', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Setup mock to throw database connection error
      jest.requireMock('../../../../src/domain/models/Candidate').Candidate.shouldThrowConnectionError = true;

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('No se pudo conectar con la base de datos');
    });
  });
}); 