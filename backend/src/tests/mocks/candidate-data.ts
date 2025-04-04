import { Prisma } from '@prisma/client';

export const validCandidateData: Prisma.CandidateCreateInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  address: '123 Main St, City',
  educations: {
    create: [
      {
        institution: 'University',
        title: 'Computer Science',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-30'),
      },
    ],
  },
  workExperiences: {
    create: [
      {
        company: 'Tech Corp',
        position: 'Software Dev',
        startDate: new Date('2022-07-01'),
        endDate: new Date('2023-12-31'),
        description: 'Full-stack development',
      },
    ],
  },
};

export const minimalCandidateData: Prisma.CandidateCreateInput = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@test.com',
};

export const invalidCandidateData = {
  firstName: 'Invalid',
  lastName: 'User',
  email: 'invalid-email',
};

export const mockCVFile = {
  fieldname: 'cv',
  originalname: 'resume.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('mock pdf content'),
  size: 1024,
} as Express.Multer.File;

export const mockInvalidFile = {
  fieldname: 'cv',
  originalname: 'image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('mock image content'),
  size: 1024,
} as Express.Multer.File;
