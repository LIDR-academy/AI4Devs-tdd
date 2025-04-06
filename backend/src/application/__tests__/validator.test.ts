import { validateCandidateData } from '../validator';

describe('Validator', () => {
  describe('validateCandidateData', () => {
    it('should validate a candidate with required fields', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '612345678',
        address: '123 Main St'
      };

      expect(() => validateCandidateData(validData)).not.toThrow();
    });

    it('should validate a candidate with all fields including education and work experience', () => {
      const validData = {
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
            position: 'Software Engineer',
            description: 'Full-stack development',
            startDate: '2024-01-01'
          }
        ],
        cv: {
          filePath: '/path/to/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      expect(() => validateCandidateData(validData)).not.toThrow();
    });

    describe('Name validation', () => {
      it('should throw error for invalid first name', () => {
        const invalidData = {
          firstName: '123', // Invalid: contains numbers
          lastName: 'Doe',
          email: 'john.doe@example.com'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });

      it('should throw error for invalid last name', () => {
        const invalidData = {
          firstName: 'John',
          lastName: '', // Invalid: empty
          email: 'john.doe@example.com'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid name');
      });
    });

    describe('Email validation', () => {
      it('should throw error for invalid email format', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email'
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid email');
      });
    });

    describe('Phone validation', () => {
      it('should throw error for invalid phone number', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123' // Invalid: too short
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid phone');
      });
    });

    describe('Education validation', () => {
      it('should throw error for invalid education data', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          educations: [
            {
              institution: '', // Invalid: empty
              title: 'Degree',
              startDate: '2020-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid institution');
      });

      it('should throw error for invalid education dates', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          educations: [
            {
              institution: 'University',
              title: 'Degree',
              startDate: 'invalid-date' // Invalid date format
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid date');
      });
    });

    describe('Work Experience validation', () => {
      it('should throw error for invalid work experience data', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          workExperiences: [
            {
              company: '', // Invalid: empty
              position: 'Developer',
              startDate: '2020-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid company');
      });

      it('should throw error for invalid work experience description length', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          workExperiences: [
            {
              company: 'Company',
              position: 'Developer',
              description: 'a'.repeat(201), // Invalid: too long
              startDate: '2020-01-01'
            }
          ]
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid description');
      });
    });

    describe('CV validation', () => {
      it('should throw error for invalid CV data', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          cv: {
            // Missing required fields
          }
        };

        expect(() => validateCandidateData(invalidData)).toThrow('Invalid CV data');
      });
    });
  });
}); 