// Unmock the validator since we want to test the actual implementation
jest.unmock('../application/validator');

import { validateCandidateData } from '../application/validator';

// Here we're testing the actual validator implementation, not mocks
describe('Validator Tests', () => {
  describe('validateCandidateData', () => {
    const validCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678',
      address: '123 Main St',
    };

    it('should validate correct candidate data without throwing errors', () => {
      // Act & Assert
      expect(() => validateCandidateData(validCandidateData)).not.toThrow();
    });

    it('should skip validation if id is provided (edit mode)', () => {
      // Arrange
      const candidateDataWithId = {
        id: 1,
        firstName: '', // Invalid but should be ignored in edit mode
        lastName: '', // Invalid but should be ignored in edit mode
        email: 'invalid', // Invalid but should be ignored in edit mode
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateDataWithId)).not.toThrow();
    });

    it('should throw error for invalid firstName', () => {
      // Arrange
      const invalidFirstName = {
        ...validCandidateData,
        firstName: '123', // Contains numbers which is invalid
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidFirstName)).toThrow();
    });

    it('should throw error for invalid lastName', () => {
      // Arrange
      const invalidLastName = {
        ...validCandidateData,
        lastName: '123', // Contains numbers which is invalid
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidLastName)).toThrow();
    });

    it('should throw error for invalid email', () => {
      // Arrange
      const invalidEmail = {
        ...validCandidateData,
        email: 'not-an-email',
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidEmail)).toThrow();
    });

    it('should throw error for invalid phone', () => {
      // Arrange
      const invalidPhone = {
        ...validCandidateData,
        phone: '12345', // Too short and doesn't start with 6, 7, or 9
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidPhone)).toThrow();
    });

    it('should throw error for too long address', () => {
      // Arrange
      const invalidAddress = {
        ...validCandidateData,
        address: 'a'.repeat(101), // Exceeds 100 characters
      };

      // Act & Assert
      expect(() => validateCandidateData(invalidAddress)).toThrow();
    });

    it('should validate candidate with education', () => {
      // Arrange
      const candidateWithValidEducation = {
        ...validCandidateData,
        educations: [
          {
            institution: 'University',
            title: 'Computer Science',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
          },
        ],
      };

      // Act & Assert
      expect(() =>
        validateCandidateData(candidateWithValidEducation),
      ).not.toThrow();
    });

    it('should validate candidate with work experience', () => {
      // Arrange
      const candidateWithValidExperience = {
        ...validCandidateData,
        workExperiences: [
          {
            company: 'Tech Company',
            position: 'Developer',
            description: 'Developing software',
            startDate: '2020-01-01',
            endDate: '2022-01-01',
          },
        ],
      };

      // Act & Assert
      expect(() =>
        validateCandidateData(candidateWithValidExperience),
      ).not.toThrow();
    });

    it('should validate candidate with CV', () => {
      // Arrange
      const candidateWithCV = {
        ...validCandidateData,
        cv: {
          filePath: '/path/to/resume.pdf',
          fileType: 'application/pdf',
        },
      };

      // Act & Assert
      expect(() => validateCandidateData(candidateWithCV)).not.toThrow();
    });
  });
});
