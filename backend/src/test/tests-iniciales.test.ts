import { PrismaClient } from '@prisma/client';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { mockPrismaClient, validCandidateData } from './test-helpers';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient())
  };
});

// Mock the domain models
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation(() => {
      return {
        id: undefined,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '612345678',
        address: 'Calle Test 123',
        education: [],
        workExperience: [],
        resumes: [],
        save: jest.fn().mockResolvedValue({ 
          id: 1, 
          firstName: 'John', 
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }),
      };
    })
  };
});

jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation(() => {
      return {
        id: undefined,
        institution: 'Test University',
        title: 'Computer Science',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-30'),
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1 }),
      };
    })
  };
});

jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation(() => {
      return {
        id: undefined,
        company: 'Test Company',
        position: 'Developer',
        description: 'Developing software',
        startDate: new Date('2019-07-01'),
        endDate: new Date('2023-01-01'),
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1 }),
      };
    })
  };
});

jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation(() => {
      return {
        id: undefined,
        filePath: 'uploads/test-cv.pdf',
        fileType: 'application/pdf',
        uploadDate: new Date(),
        candidateId: undefined,
        save: jest.fn().mockResolvedValue({ id: 1 }),
      };
    })
  };
});

describe('Candidate Creation', () => {
  // Unit test for the service layer
  describe('Candidate Service', () => {
    it('should successfully add a candidate', async () => {
      const result = await addCandidate(validCandidateData);
      
      expect(result).toBeDefined();
      expect(Candidate).toHaveBeenCalledWith(validCandidateData);
      expect(result.id).toBe(1);
    });
    
    it('should throw an error if validation fails', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email'
      };
      
      await expect(addCandidate(invalidData)).rejects.toThrow();
    });
  });

  // Test for the Candidate model
  describe('Candidate Model', () => {
    it('should save a candidate to the database', async () => {
      const candidate = new Candidate(validCandidateData);
      const savedCandidate = await candidate.save();
      
      expect(savedCandidate).toBeDefined();
      expect(savedCandidate.id).toBe(1);
    });
  });

  // Test for the Education model
  describe('Education Model', () => {
    it('should save education data', async () => {
      const educationData = validCandidateData.educations[0];
      const education = new Education(educationData);
      education.candidateId = 1;
      
      const savedEducation = await education.save();
      
      expect(savedEducation).toBeDefined();
      expect(savedEducation.id).toBe(1);
    });
  });

  // Test for the WorkExperience model
  describe('WorkExperience Model', () => {
    it('should save work experience data', async () => {
      const workExperienceData = validCandidateData.workExperiences[0];
      const workExperience = new WorkExperience(workExperienceData);
      workExperience.candidateId = 1;
      
      const savedWorkExperience = await workExperience.save();
      
      expect(savedWorkExperience).toBeDefined();
      expect(savedWorkExperience.id).toBe(1);
    });
  });

  // Test for the Resume model
  describe('Resume Model', () => {
    it('should save resume data', async () => {
      const resumeData = validCandidateData.cv;
      const resume = new Resume(resumeData);
      resume.candidateId = 1;
      
      const savedResume = await resume.save();
      
      expect(savedResume).toBeDefined();
      expect(savedResume.id).toBe(1);
    });
  });
});