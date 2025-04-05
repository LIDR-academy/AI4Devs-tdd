import { validateCandidateData } from '../validator';

describe('Candidate Data Validator', () => {
  describe('Name Validation', () => {
    it('should validate a correct name', () => {
      // Arrange
      const validName = 'John Doe';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: validName, lastName: validName, email: 'john@example.com' })).not.toThrow();
    });

    it('should throw error for name with special characters', () => {
      // Arrange
      const invalidName = 'John@Doe';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: invalidName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
    });

    it('should throw error for name that is too short', () => {
      // Arrange
      const shortName = 'J';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: shortName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
    });

    it('should throw error for name that is too long', () => {
      // Arrange
      const longName = 'J'.repeat(101);

      // Act & Assert
      expect(() => validateCandidateData({ firstName: longName, lastName: 'Doe', email: 'john@example.com' })).toThrow('Invalid name');
    });
  });

  describe('Email Validation', () => {
    it('should validate a correct email', () => {
      // Arrange
      const validEmail = 'john.doe@example.com';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: validEmail })).not.toThrow();
    });

    it('should throw error for email without @', () => {
      // Arrange
      const invalidEmail = 'john.doeexample.com';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: invalidEmail })).toThrow('Invalid email');
    });

    it('should throw error for email without domain', () => {
      // Arrange
      const invalidEmail = 'john.doe@';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: invalidEmail })).toThrow('Invalid email');
    });
  });

  describe('Phone Validation', () => {
    it('should validate a correct phone number', () => {
      // Arrange
      const validPhone = '612345678';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: validPhone })).not.toThrow();
    });

    it('should throw error for phone number with incorrect format', () => {
      // Arrange
      const invalidPhone = '123456789';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: invalidPhone })).toThrow('Invalid phone');
    });

    it('should not throw error for empty phone number', () => {
      // Arrange
      const emptyPhone = '';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: emptyPhone })).not.toThrow();
    });
  });

  describe('Address Validation', () => {
    it('should validate a correct address', () => {
      // Arrange
      const validAddress = '123 Main St, New York, USA';

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', address: validAddress })).not.toThrow();
    });

    it('should throw error for address that is too long', () => {
      // Arrange
      const longAddress = 'A'.repeat(101);

      // Act & Assert
      expect(() => validateCandidateData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', address: longAddress })).toThrow('Invalid address');
    });
  });

  describe('Education Validation', () => {
    it('should validate correct education data', () => {
      // Arrange
      const validEducation = {
        institution: 'University of Technology',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
        endDate: '2024-01-01'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        educations: [validEducation]
      })).not.toThrow();
    });

    it('should throw error for missing institution', () => {
      // Arrange
      const invalidEducation = {
        title: 'Bachelor of Science',
        startDate: '2020-01-01'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        educations: [invalidEducation]
      })).toThrow('Invalid institution');
    });

    it('should throw error for invalid date format', () => {
      // Arrange
      const invalidEducation = {
        institution: 'University of Technology',
        title: 'Bachelor of Science',
        startDate: '2020/01/01'
      };

      // Act & Assert
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
      // Arrange
      const validExperience = {
        company: 'Tech Corp',
        position: 'Software Engineer',
        description: 'Worked on various projects',
        startDate: '2020-01-01',
        endDate: '2022-12-31'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        workExperiences: [validExperience]
      })).not.toThrow();
    });

    it('should throw error for missing company', () => {
      // Arrange
      const invalidExperience = {
        position: 'Software Engineer',
        startDate: '2020-01-01'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        workExperiences: [invalidExperience]
      })).toThrow('Invalid company');
    });

    it('should throw error for invalid date format', () => {
      // Arrange
      const invalidExperience = {
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '2020/01/01'
      };

      // Act & Assert
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
      // Arrange
      const validCV = {
        filePath: '/path/to/cv.pdf',
        fileType: 'application/pdf'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        cv: validCV
      })).not.toThrow();
    });

    it('should throw error for missing filePath', () => {
      // Arrange
      const invalidCV = {
        fileType: 'application/pdf'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        cv: invalidCV
      })).toThrow('Invalid CV data');
    });

    it('should throw error for missing fileType', () => {
      // Arrange
      const invalidCV = {
        filePath: '/path/to/cv.pdf'
      };

      // Act & Assert
      expect(() => validateCandidateData({ 
        firstName: 'John', 
        lastName: 'Doe', 
        email: 'john@example.com',
        cv: invalidCV
      })).toThrow('Invalid CV data');
    });
  });
}); 