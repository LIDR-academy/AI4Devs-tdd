import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { validateCandidateData } from '../application/validator';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';

// Mock dependencies
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator');

describe('Candidate Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate', () => {
    const mockCandidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    const mockSavedCandidate = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
    };

    it('should validate candidate data and save it successfully', async () => {
      // Arrange
      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const saveMock = jest.fn().mockResolvedValue(mockSavedCandidate);
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: saveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act
      const result = await addCandidate(mockCandidateData);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
      expect(Candidate).toHaveBeenCalledWith(mockCandidateData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const validationError = new Error('Validation failed');
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
      expect(Candidate).not.toHaveBeenCalled();
    });

    it('should handle database errors when saving candidate', async () => {
      // Arrange
      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const dbError = new Error('Database error');
      const saveMock = jest.fn().mockRejectedValue(dbError);
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: saveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow();
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should handle unique constraint violation (email already exists)', async () => {
      // Arrange
      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const uniqueConstraintError = { code: 'P2002' };
      const saveMock = jest.fn().mockRejectedValue(uniqueConstraintError);
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: saveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act & Assert
      await expect(addCandidate(mockCandidateData)).rejects.toThrow(
        'The email already exists in the database',
      );
      expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should save candidate with education', async () => {
      // Arrange
      const candidateWithEducation = {
        ...mockCandidateData,
        educations: [
          {
            institution: 'University',
            title: 'Computer Science',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2022-01-01'),
          },
        ],
      };

      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const candidateSaveMock = jest
        .fn()
        .mockResolvedValue({ ...mockSavedCandidate, id: 1 });
      const educationSaveMock = jest.fn().mockResolvedValue({ id: 1 });

      // Mock the Education constructor
      (Education as any).mockImplementation(() => ({
        save: educationSaveMock,
        candidateId: 0,
      }));

      // Mock the Candidate constructor
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: candidateSaveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act
      const result = await addCandidate(candidateWithEducation);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(
        candidateWithEducation,
      );
      expect(Candidate).toHaveBeenCalledWith(candidateWithEducation);
      expect(candidateSaveMock).toHaveBeenCalled();
      expect(Education).toHaveBeenCalledWith(
        candidateWithEducation.educations[0],
      );
      expect(educationSaveMock).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should save candidate with work experience', async () => {
      // Arrange
      const candidateWithWorkExperience = {
        ...mockCandidateData,
        workExperiences: [
          {
            company: 'Tech Company',
            position: 'Developer',
            description: 'Developing software',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2022-01-01'),
          },
        ],
      };

      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const candidateSaveMock = jest
        .fn()
        .mockResolvedValue({ ...mockSavedCandidate, id: 1 });
      const workExperienceSaveMock = jest.fn().mockResolvedValue({ id: 1 });

      // Mock the WorkExperience constructor
      (WorkExperience as any).mockImplementation(() => ({
        save: workExperienceSaveMock,
        candidateId: 0,
      }));

      // Mock the Candidate constructor
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: candidateSaveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act
      const result = await addCandidate(candidateWithWorkExperience);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(
        candidateWithWorkExperience,
      );
      expect(Candidate).toHaveBeenCalledWith(candidateWithWorkExperience);
      expect(candidateSaveMock).toHaveBeenCalled();
      expect(WorkExperience).toHaveBeenCalledWith(
        candidateWithWorkExperience.workExperiences[0],
      );
      expect(workExperienceSaveMock).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should save candidate with CV (resume)', async () => {
      // Arrange
      const candidateWithCV = {
        ...mockCandidateData,
        cv: {
          filePath: '/path/to/resume.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date(),
        },
      };

      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const candidateSaveMock = jest
        .fn()
        .mockResolvedValue({ ...mockSavedCandidate, id: 1 });
      const resumeSaveMock = jest.fn().mockResolvedValue({ id: 1 });

      // Mock the Resume constructor
      (Resume as any).mockImplementation(() => ({
        save: resumeSaveMock,
        candidateId: 0,
      }));

      // Mock the Candidate constructor
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: candidateSaveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act
      const result = await addCandidate(candidateWithCV);

      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(candidateWithCV);
      expect(Candidate).toHaveBeenCalledWith(candidateWithCV);
      expect(candidateSaveMock).toHaveBeenCalled();
      expect(Resume).toHaveBeenCalledWith(candidateWithCV.cv);
      expect(resumeSaveMock).toHaveBeenCalled();
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should handle errors when saving related entities', async () => {
      // Arrange
      const candidateWithEducation = {
        ...mockCandidateData,
        educations: [
          {
            institution: 'University',
            title: 'Computer Science',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2022-01-01'),
          },
        ],
      };

      (validateCandidateData as jest.Mock).mockImplementation(() => undefined);

      const candidateSaveMock = jest
        .fn()
        .mockResolvedValue({ ...mockSavedCandidate, id: 1 });
      const educationError = new Error('Failed to save education');
      const educationSaveMock = jest.fn().mockRejectedValue(educationError);

      // Mock the Education constructor
      (Education as any).mockImplementation(() => ({
        save: educationSaveMock,
        candidateId: 0,
      }));

      // Mock the Candidate constructor
      (Candidate as any).mockImplementation(() => ({
        id: 1,
        save: candidateSaveMock,
        education: [],
        workExperience: [],
        resumes: [],
      }));

      // Act & Assert
      await expect(addCandidate(candidateWithEducation)).rejects.toThrow(
        'Failed to save education',
      );
      expect(validateCandidateData).toHaveBeenCalledWith(
        candidateWithEducation,
      );
      expect(Candidate).toHaveBeenCalledWith(candidateWithEducation);
      expect(candidateSaveMock).toHaveBeenCalled();
      expect(Education).toHaveBeenCalledWith(
        candidateWithEducation.educations[0],
      );
      expect(educationSaveMock).toHaveBeenCalled();
    });
  });
});
