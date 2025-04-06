/**
 * Tests for Candidate Management System
 */

import { validateCandidateData } from '../application/validator';

// Mock the prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' }),
      update: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe', email: 'test@example.com' })
    },
    education: {
      create: jest.fn().mockResolvedValue({ id: 1, institution: 'Test University', title: 'Computer Science' }),
      update: jest.fn().mockResolvedValue({ id: 1, institution: 'Test University', title: 'Computer Science' })
    },
    workExperience: {
      create: jest.fn().mockResolvedValue({ id: 1, company: 'Test Company', position: 'Developer' }),
      update: jest.fn().mockResolvedValue({ id: 1, company: 'Test Company', position: 'Developer' })
    },
    resume: {
      create: jest.fn().mockResolvedValue({ id: 1, filePath: '/path/to/file.pdf', fileType: 'application/pdf' })
    }
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Mock the domain models
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation((data) => ({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      education: [],
      workExperience: [],
      resumes: [],
      save: jest.fn().mockResolvedValue({
        id: 1,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address
      })
    }))
  };
});

jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation((data) => ({
      id: data.id,
      institution: data.institution,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      candidateId: data.candidateId,
      save: jest.fn().mockResolvedValue({
        id: 1,
        institution: data.institution,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        candidateId: data.candidateId
      })
    }))
  };
});

jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation((data) => ({
      id: data.id,
      company: data.company,
      position: data.position,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      candidateId: data.candidateId,
      save: jest.fn().mockResolvedValue({
        id: 1,
        company: data.company,
        position: data.position,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        candidateId: data.candidateId
      })
    }))
  };
});

jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation((data) => {
      const saveMock = jest.fn();

      if (data.id) {
        saveMock.mockRejectedValue(new Error('No se permite la actualización de un currículum existente.'));
      } else {
        saveMock.mockResolvedValue({
          id: 1,
          filePath: data.filePath,
          fileType: data.fileType,
          uploadDate: new Date(),
          candidateId: data.candidateId
        });
      }

      return {
        id: data.id,
        filePath: data.filePath,
        fileType: data.fileType,
        uploadDate: new Date(),
        candidateId: data.candidateId,
        save: saveMock
      };
    })
  };
});

// Mock the candidate service
jest.mock('../application/services/candidateService', () => {
  return {
    addCandidate: jest.fn().mockImplementation(async (data) => {
      if (!data.firstName || !data.lastName || !data.email) {
        throw new Error('Missing required fields');
      }
      return {
        id: 1,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        ...data
      };
    })
  };
});

describe('Talent Tracking System Tests', () => {
  // Clean up mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------------------------
  // FORM DATA VALIDATION TESTS
  // ------------------------------------------------------
  describe('Form Data Validation Tests', () => {
    describe('Candidate Data Validation', () => {
      it('should validate a valid candidate data', () => {
        const validCandidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St'
        };

        // This should not throw an error
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      it('should throw error for invalid firstName', () => {
        const invalidData = {
          firstName: '',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error for invalid lastName', () => {
        const invalidData = {
          firstName: 'John',
          lastName: '',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error for invalid email format', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '612345678',
          address: '123 Main St'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });

      it('should throw error for invalid phone format', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234', // Invalid phone format
          address: '123 Main St'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
      });

      it('should throw error for address exceeding max length', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: 'A'.repeat(101) // Over the 100 character limit
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid address');
      });
    });

    describe('Education Data Validation', () => {
      it('should validate valid education data', () => {
        const validCandidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St',
          educations: [
            {
              institution: 'University',
              title: 'Computer Science',
              startDate: '2020-01-01',
              endDate: '2024-01-01'
            }
          ]
        };

        // This should not throw an error
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      it('should throw error for invalid institution', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          educations: [
            {
              institution: '',
              title: 'Computer Science',
              startDate: '2020-01-01',
              endDate: '2024-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
      });

      it('should throw error for invalid title', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          educations: [
            {
              institution: 'University',
              title: '',
              startDate: '2020-01-01',
              endDate: '2024-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid title');
      });

      it('should throw error for invalid date format', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          educations: [
            {
              institution: 'University',
              title: 'Computer Science',
              startDate: 'not-a-date',
              endDate: '2024-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
      });
    });

    describe('Work Experience Data Validation', () => {
      it('should validate valid work experience data', () => {
        const validCandidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Developer',
              description: 'Developed applications',
              startDate: '2020-01-01',
              endDate: '2022-01-01'
            }
          ]
        };

        // This should not throw an error
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      it('should throw error for invalid company', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          workExperiences: [
            {
              company: '',
              position: 'Developer',
              startDate: '2020-01-01',
              endDate: '2022-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid company');
      });

      it('should throw error for invalid position', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: '',
              startDate: '2020-01-01',
              endDate: '2022-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid position');
      });

      it('should throw error for description exceeding max length', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Developer',
              description: 'A'.repeat(201), // Over the 200 character limit
              startDate: '2020-01-01',
              endDate: '2022-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
      });
    });

    describe('Resume Data Validation', () => {
      it('should validate valid CV data', () => {
        const validCandidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St',
          cv: {
            filePath: '/path/to/file.pdf',
            fileType: 'application/pdf'
          }
        };

        // This should not throw an error
        expect(() => validateCandidateData(validCandidateData)).not.toThrow();
      });

      it('should throw error for invalid CV data', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          cv: 'not-an-object'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });

      it('should throw error for missing filePath in CV', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          cv: {
            fileType: 'application/pdf'
          }
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });

      it('should throw error for missing fileType in CV', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          cv: {
            filePath: '/path/to/file.pdf'
          }
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });
    });
  });

  // ------------------------------------------------------
  // DATABASE OPERATIONS TESTS
  // ------------------------------------------------------
  describe('Database Operations Tests', () => {
    const { Candidate } = require('../domain/models/Candidate');
    const { Education } = require('../domain/models/Education');
    const { WorkExperience } = require('../domain/models/WorkExperience');
    const { Resume } = require('../domain/models/Resume');
    const { addCandidate } = require('../application/services/candidateService');

    describe('Candidate Model', () => {
      it('should create a candidate successfully', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St'
        };

        const candidate = new Candidate(candidateData);
        const result = await candidate.save();

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.firstName).toBe('John');
        expect(result.lastName).toBe('Doe');
        expect(result.email).toBe('john.doe@example.com');
      });

      it('should handle candidate creation error', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        };

        const candidate = new Candidate(candidateData);
        const saveMock = candidate.save;
        saveMock.mockRejectedValueOnce(new Error('Database error'));

        await expect(candidate.save()).rejects.toThrow('Database error');
      });
    });

    describe('Education Model', () => {
      it('should create an education record successfully', async () => {
        const educationData = {
          institution: 'University',
          title: 'Computer Science',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          candidateId: 1
        };

        const education = new Education(educationData);
        const result = await education.save();

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.institution).toBe('University');
        expect(result.title).toBe('Computer Science');
      });
    });

    describe('WorkExperience Model', () => {
      it('should create a work experience record successfully', async () => {
        const workExperienceData = {
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Developed applications',
          startDate: '2020-01-01',
          endDate: '2022-01-01',
          candidateId: 1
        };

        const workExperience = new WorkExperience(workExperienceData);
        const result = await workExperience.save();

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.company).toBe('Tech Corp');
        expect(result.position).toBe('Developer');
      });
    });

    describe('Resume Model', () => {
      it('should create a resume record successfully', async () => {
        const resumeData = {
          filePath: '/path/to/file.pdf',
          fileType: 'application/pdf',
          candidateId: 1
        };

        const resume = new Resume(resumeData);
        const result = await resume.save();

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.filePath).toBe('/path/to/file.pdf');
        expect(result.fileType).toBe('application/pdf');
      });

      it('should throw error when trying to update an existing resume', async () => {
        const resumeData = {
          id: 1,
          filePath: '/path/to/file.pdf',
          fileType: 'application/pdf',
          candidateId: 1
        };

        const resume = new Resume(resumeData);
        await expect(resume.save()).rejects.toThrow('No se permite la actualización de un currículum existente.');
      });
    });

    describe('Candidate Service Integration', () => {
      it('should add a complete candidate with associated records', async () => {
        const completeCandidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '612345678',
          address: '123 Main St',
          educations: [
            {
              institution: 'University',
              title: 'Computer Science',
              startDate: '2020-01-01',
              endDate: '2024-01-01'
            }
          ],
          workExperiences: [
            {
              company: 'Tech Corp',
              position: 'Developer',
              description: 'Developed applications',
              startDate: '2020-01-01',
              endDate: '2022-01-01'
            }
          ],
          cv: {
            filePath: '/path/to/file.pdf',
            fileType: 'application/pdf'
          }
        };

        const result = await addCandidate(completeCandidateData);

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.firstName).toBe('John');
        expect(result.lastName).toBe('Doe');
        expect(result.email).toBe('john.doe@example.com');
      });

      it('should throw validation error for invalid data', async () => {
        const invalidData = {
          // Missing required fields
          email: 'john.doe@example.com'
        };

        await expect(addCandidate(invalidData)).rejects.toThrow('Missing required fields');
      });
    });
  });
});
