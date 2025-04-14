import { PrismaClient } from '@prisma/client';

// Mock Prisma client for tests
export const mockPrismaClient = () => {
  const prisma = {
    candidate: {
      create: jest.fn().mockResolvedValue({ id: 1, firstName: 'John', lastName: 'Doe' }),
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  
  return prisma as unknown as PrismaClient;
};

// Sample valid candidate data for tests
export const validCandidateData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '612345678',
  address: 'Calle Test 123',
  educations: [
    {
      institution: 'Test University',
      title: 'Computer Science',
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    }
  ],
  workExperiences: [
    {
      company: 'Test Company',
      position: 'Developer',
      description: 'Developing software',
      startDate: '2019-07-01',
      endDate: '2023-01-01'
    }
  ],
  cv: {
    filePath: 'uploads/test-cv.pdf',
    fileType: 'application/pdf'
  }
};