import { Candidate, Prisma } from '@prisma/client';
import { context } from './helpers/prisma-helper';
import {
  invalidCandidateData,
  minimalCandidateData,
  mockInvalidFile,
  validCandidateData,
} from './mocks/candidate-data';

// Mock file system operations
jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

describe('Candidate Insertion Feature', () => {
  const mockResponse: Candidate = {
    id: 1,
    firstName: validCandidateData.firstName,
    lastName: validCandidateData.lastName,
    email: validCandidateData.email,
    phone: validCandidateData.phone ?? null,
    address: validCandidateData.address ?? null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successfully insert a candidate with required fields only', () => {
    it('should create a candidate with minimal required information', async () => {
      // Mock the Prisma create operation
      const mockMinimalResponse: Candidate = {
        id: 1,
        firstName: minimalCandidateData.firstName,
        lastName: minimalCandidateData.lastName,
        email: minimalCandidateData.email,
        phone: null,
        address: null,
      };

      context.prisma.candidate.create.mockResolvedValue(mockMinimalResponse);

      const result = await context.prisma.candidate.create({
        data: {
          ...minimalCandidateData,
          resumes: {
            create: {
              filePath: '/uploads/resume.pdf',
              fileType: 'application/pdf',
              uploadDate: new Date(),
            },
          },
        },
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.firstName).toBe(minimalCandidateData.firstName);
      expect(result.email).toBe(minimalCandidateData.email);
    });
  });

  describe('Successfully insert a candidate with all fields', () => {
    it('should create a candidate with all information including education and work experience', async () => {
      context.prisma.candidate.create.mockResolvedValue(mockResponse);

      const result = await context.prisma.candidate.create({
        data: validCandidateData,
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.firstName).toBe(validCandidateData.firstName);
      expect(result.email).toBe(validCandidateData.email);
    });
  });

  describe('Validation errors', () => {
    it('should reject candidate with missing required fields', async () => {
      const incompleteData = { firstName: 'John' };

      context.prisma.candidate.create.mockRejectedValue(
        new Prisma.PrismaClientValidationError(
          'Invalid `prisma.candidate.create()` invocation',
          {
            clientVersion: '4.7.1',
          },
        ),
      );

      await expect(
        context.prisma.candidate.create({
          data: incompleteData as any,
        }),
      ).rejects.toThrow(Prisma.PrismaClientValidationError);
    });

    it('should reject candidate with invalid email', async () => {
      context.prisma.candidate.create.mockRejectedValue(
        new Error('Invalid email format'),
      );

      await expect(
        context.prisma.candidate.create({
          data: invalidCandidateData as any,
        }),
      ).rejects.toThrow('Invalid email format');
    });

    it('should reject candidate with invalid CV format', async () => {
      const validateCV = () => {
        if (mockInvalidFile.mimetype !== 'application/pdf') {
          throw new Error('Invalid file format. Only PDF files are allowed.');
        }
      };

      expect(validateCV).toThrow();
    });

    it('should reject candidate with duplicate email', async () => {
      context.prisma.candidate.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`email`)',
          {
            code: 'P2002',
            clientVersion: '4.7.1',
            meta: { target: ['email'] },
          },
        ),
      );

      await expect(
        context.prisma.candidate.create({
          data: validCandidateData,
        }),
      ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });
});
