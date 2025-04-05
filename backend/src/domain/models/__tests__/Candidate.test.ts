import { Candidate } from '../Candidate';
import { WorkExperience } from '../WorkExperience';
import { Education } from '../Education';
import { Resume } from '../Resume';

describe('Candidate Model', () => {
  describe('Creation', () => {
    it('should create a valid candidate with all required fields', () => {
      // Arrange
      const validCandidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA',
        workExperience: [
          new WorkExperience({
            company: 'Tech Corp',
            position: 'Software Engineer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-12-31'),
            description: 'Worked on various projects'
          })
        ],
        education: [
          new Education({
            institution: 'University of Technology',
            title: 'Bachelor of Science',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-05-31')
          })
        ],
        resumes: [
          new Resume({
            filePath: '/path/to/resume.pdf',
            fileType: 'application/pdf'
          })
        ]
      };

      // Act
      const candidate = new Candidate(validCandidateData);

      // Assert
      expect(candidate).toBeDefined();
      expect(candidate.firstName).toBe(validCandidateData.firstName);
      expect(candidate.lastName).toBe(validCandidateData.lastName);
      expect(candidate.email).toBe(validCandidateData.email);
      expect(candidate.workExperience).toHaveLength(1);
      expect(candidate.education).toHaveLength(1);
      expect(candidate.resumes).toHaveLength(1);
    });

    it('should handle optional fields correctly', () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate).toBeDefined();
      expect(candidate.phone).toBeUndefined();
      expect(candidate.address).toBeUndefined();
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.education).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });
  });

  describe('Work Experience', () => {
    it('should handle current position correctly', () => {
      // Arrange
      const currentPosition = {
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: new Date('2020-01-01'),
        description: 'Currently working here'
      };

      // Act
      const workExperience = new WorkExperience(currentPosition);

      // Assert
      expect(workExperience.endDate).toBeUndefined();
    });
  });

  describe('Education', () => {
    it('should handle ongoing education correctly', () => {
      // Arrange
      const ongoingEducation = {
        institution: 'University of Technology',
        title: 'Bachelor of Science',
        startDate: new Date('2020-09-01')
      };

      // Act
      const education = new Education(ongoingEducation);

      // Assert
      expect(education.endDate).toBeUndefined();
    });
  });
}); 