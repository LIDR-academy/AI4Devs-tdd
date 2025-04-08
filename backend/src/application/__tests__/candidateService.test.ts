import { addCandidate } from '../services/candidateService';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

// Mock the models
jest.mock('../../domain/models/Candidate', () => {
  const mockSave = jest.fn();
  const MockCandidate = jest.fn().mockImplementation((data) => ({
    ...data,
    education: [],
    workExperience: [],
    resumes: [],
    save: mockSave
  }));
  return { Candidate: MockCandidate };
});

jest.mock('../../domain/models/Education', () => {
  const mockSave = jest.fn();
  const MockEducation = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));
  return { Education: MockEducation };
});

jest.mock('../../domain/models/WorkExperience', () => {
  const mockSave = jest.fn();
  const MockWorkExperience = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));
  return { WorkExperience: MockWorkExperience };
});

jest.mock('../../domain/models/Resume', () => {
  const mockSave = jest.fn();
  const MockResume = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));
  return { Resume: MockResume };
});

describe('Candidate Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate', () => {
    it('should successfully add a candidate with basic information', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '612345678',
        address: '123 Main St'
      };

      const mockSavedCandidate = { ...candidateData, id: 1 };
      const mockCandidate = new Candidate(candidateData);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedCandidate));

      const result = await addCandidate(candidateData);

      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should add a candidate with education history', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        address: null,
        educations: [
          {
            institution: 'University',
            title: 'Computer Science',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }
        ]
      };

      const mockSavedCandidate = { 
        ...candidateData, 
        id: 1,
        education: [],
        workExperience: [],
        resumes: []
      };

      const mockSavedEducation = {
        id: 1,
        institution: 'University',
        title: 'Computer Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 1
      };

      const mockCandidate = new Candidate(candidateData);
      const mockEducation = new Education(candidateData.educations[0]);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedCandidate));
      (mockEducation.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedEducation));

      const result = await addCandidate(candidateData);

      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should add a candidate with work experience', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        address: null,
        workExperiences: [
          {
            company: 'Tech Corp',
            position: 'Software Engineer',
            description: 'Full-stack development',
            startDate: '2024-01-01'
          }
        ]
      };

      const mockSavedCandidate = { 
        ...candidateData, 
        id: 1,
        education: [],
        workExperience: [],
        resumes: []
      };

      const mockSavedExperience = {
        id: 1,
        company: 'Tech Corp',
        position: 'Software Engineer',
        description: 'Full-stack development',
        startDate: new Date('2024-01-01'),
        endDate: null,
        candidateId: 1
      };

      const mockCandidate = new Candidate(candidateData);
      const mockExperience = new WorkExperience(candidateData.workExperiences[0]);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedCandidate));
      (mockExperience.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedExperience));

      const result = await addCandidate(candidateData);

      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should add a candidate with CV', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        address: null,
        cv: {
          filePath: '/path/to/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const mockSavedCandidate = { 
        ...candidateData, 
        id: 1,
        education: [],
        workExperience: [],
        resumes: []
      };

      const mockSavedResume = new Resume({
        id: 1,
        candidateId: 1,
        filePath: '/path/to/cv.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date()
      });

      const mockCandidate = new Candidate(candidateData);
      const mockResume = new Resume(candidateData.cv);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedCandidate));
      (mockResume.save as jest.Mock).mockImplementation(() => Promise.resolve(mockSavedResume));

      const result = await addCandidate(candidateData);

      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(Resume).toHaveBeenCalledWith(candidateData.cv);
      expect(result).toEqual(mockSavedCandidate);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        firstName: '123', // Invalid name
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      await expect(addCandidate(invalidData)).rejects.toThrow('Invalid name');
    });

    it('should handle database errors', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        address: null
      };

      const mockCandidate = new Candidate(candidateData);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.reject(new Error('Database error')));

      await expect(addCandidate(candidateData)).rejects.toThrow('Database error');
    });

    it('should handle duplicate email error', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: null,
        address: null
      };

      const error = new Error('Duplicate email');
      (error as any).code = 'P2002';
      const mockCandidate = new Candidate(candidateData);
      (mockCandidate.save as jest.Mock).mockImplementation(() => Promise.reject(error));

      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });
  });
}); 