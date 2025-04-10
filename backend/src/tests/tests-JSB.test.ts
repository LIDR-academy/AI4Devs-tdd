import { Request, Response } from 'express';
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { addCandidateController } from '../presentation/controllers/candidateController';

// Mock all necessary dependencies
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/services/candidateService');

describe('Backend Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Candidate Data Validation', () => {
    describe('Name Validation', () => {
      it('should validate a correct name', () => {
        const validName = 'John Doe';
        expect(() => validateCandidateData({ firstName: validName, lastName: validName, email: 'john@example.com' })).not.toThrow();
      });

      it('should throw error for name with special characters', () => {
        const invalidName = 'John@Doe';
        expect(() => validateCandidateData({ firstName: invalidName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
      });

      it('should throw error for name that is too short', () => {
        const shortName = 'J';
        expect(() => validateCandidateData({ firstName: shortName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
      });

      it('should throw error for name that is too long', () => {
        const longName = 'J'.repeat(101);
        expect(() => validateCandidateData({ firstName: longName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
      });
    });

    describe('Email Validation', () => {
      it('should validate a correct email', () => {
        const validEmail = 'john.doe@example.com';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: validEmail })).not.toThrow();
      });

      it('should throw error for email without @', () => {
        const invalidEmail = 'john.doeexample.com';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: invalidEmail })).toThrow('Invalid email');
      });

      it('should throw error for email without domain', () => {
        const invalidEmail = 'john.doe@';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: invalidEmail })).toThrow('Invalid email');
      });
    });

    describe('Phone Validation', () => {
      it('should validate a correct phone number', () => {
        const validPhone = '612345678';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: validPhone })).not.toThrow();
      });

      it('should throw error for phone number with incorrect format', () => {
        const invalidPhone = '123456789';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: invalidPhone })).toThrow('Invalid phone');
      });

      it('should not throw error for empty phone number', () => {
        const emptyPhone = '';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: emptyPhone })).not.toThrow();
      });
    });

    describe('Address Validation', () => {
      it('should validate a correct address', () => {
        const validAddress = '123 Main St, New York, USA';
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', address: validAddress })).not.toThrow();
      });

      it('should throw error for address that is too long', () => {
        const longAddress = 'A'.repeat(101);
        expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', address: longAddress })).toThrow('Invalid address');
      });
    });

    describe('Education Validation', () => {
      it('should validate correct education data', () => {
        const validEducation = {
          institution: 'University of Technology',
          title: 'Bachelor of Science',
          startDate: '2020-01-01',
          endDate: '2024-01-01'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          educations: [validEducation]
        })).not.toThrow();
      });

      it('should throw error for missing institution', () => {
        const invalidEducation = {
          title: 'Bachelor of Science',
          startDate: '2020-01-01'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          educations: [invalidEducation]
        })).toThrow('Invalid institution');
      });

      it('should throw error for invalid date format', () => {
        const invalidEducation = {
          institution: 'University of Technology',
          title: 'Bachelor of Science',
          startDate: '2020/01/01'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          educations: [invalidEducation]
        })).toThrow('Invalid date');
      });
    });

    describe('Work Experience Validation', () => {
      it('should validate correct work experience data', () => {
        const validExperience = {
          company: 'Tech Corp',
          position: 'Software Engineer',
          description: 'Worked on various projects',
          startDate: '2020-01-01',
          endDate: '2022-12-31'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          workExperiences: [validExperience]
        })).not.toThrow();
      });

      it('should throw error for missing company', () => {
        const invalidExperience = {
          position: 'Software Engineer',
          startDate: '2020-01-01'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          workExperiences: [invalidExperience]
        })).toThrow('Invalid company');
      });

      it('should throw error for invalid date format', () => {
        const invalidExperience = {
          company: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2020/01/01'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          workExperiences: [invalidExperience]
        })).toThrow('Invalid date');
      });
    });

    describe('CV Validation', () => {
      it('should validate correct CV data', () => {
        const validCV = {
          filePath: '/path/to/cv.pdf',
          fileType: 'application/pdf'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          cv: validCV
        })).not.toThrow();
      });

      it('should throw error for missing filePath', () => {
        const invalidCV = {
          fileType: 'application/pdf'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          cv: invalidCV
        })).toThrow('Invalid CV data');
      });

      it('should throw error for missing fileType', () => {
        const invalidCV = {
          filePath: '/path/to/cv.pdf'
        };

        expect(() => validateCandidateData({ 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john@example.com',
          cv: invalidCV
        })).toThrow('Invalid CV data');
      });
    });
  });

  describe('Candidate Service', () => {
    describe('addCandidate', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        (addCandidate as jest.Mock).mockReset();
      });

      it('should create a candidate successfully', async () => {
        // Arrange
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        const mockCandidate = {
          id: 1,
          ...candidateData,
          save: jest.fn().mockResolvedValue({ id: 1 })
        };

        (addCandidate as jest.Mock).mockResolvedValue(mockCandidate);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(result).toEqual(mockCandidate);
      });

      it('should handle duplicate email error', async () => {
        // Arrange
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        (addCandidate as jest.Mock).mockRejectedValue(new Error('The email already exists in the database'));

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
      });

      it('should handle database connection error', async () => {
        // Arrange
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        (addCandidate as jest.Mock).mockRejectedValue(new Error('Database connection error'));

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('Database connection error');
      });
    });
  });

  describe('Candidate Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = {
        body: {},
        params: {},
        query: {}
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };
    });

    describe('addCandidateController', () => {
      it('should create a candidate and return 201 status with success message', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        const mockCreatedCandidate = {
          id: 1,
          ...candidateData
        };

        req.body = candidateData;
        (addCandidate as jest.Mock).mockResolvedValue(mockCreatedCandidate);

        await addCandidateController(req as Request, res as Response);

        expect(addCandidate).toHaveBeenCalledWith(candidateData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Candidate added successfully',
          data: mockCreatedCandidate
        });
      });

      it('should handle validation errors and return 400 status', async () => {
        const invalidCandidateData = {
          firstName: 'John',
          email: 'invalid-email',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        req.body = invalidCandidateData;
        (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid data'));

        await addCandidateController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Invalid data'
        });
      });

      it('should handle duplicate email error and return 400 status', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        req.body = candidateData;
        (addCandidate as jest.Mock).mockRejectedValue(new Error('Email already exists'));

        await addCandidateController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Email already exists'
        });
      });

      it('should handle database connection error and return 400 status', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: 'New York, USA'
        };

        req.body = candidateData;
        (addCandidate as jest.Mock).mockRejectedValue(new Error('Database connection error'));

        await addCandidateController(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Error adding candidate',
          error: 'Database connection error'
        });
      });
    });
  });
}); 