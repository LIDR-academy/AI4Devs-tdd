import { Resume } from '../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    resume: {
      create: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('Resume Model', () => {
  let prismaClient: any;

  beforeEach(() => {
    // Get the mocked PrismaClient instance
    prismaClient = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new resume instance with all properties', () => {
      // Arrange
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);

      const resumeData = {
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
        candidateId: 1,
      };

      // Act
      const resume = new Resume(resumeData);

      // Assert
      expect(resume.filePath).toBe('/path/to/resume.pdf');
      expect(resume.fileType).toBe('application/pdf');
      expect(resume.uploadDate).toEqual(now);
      expect(resume.candidateId).toBe(1);

      jest.spyOn(global, 'Date').mockRestore();
    });

    it('should create resume instance with only required properties', () => {
      // Arrange
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);

      const resumeData = {
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
      };

      // Act
      const resume = new Resume(resumeData);

      // Assert
      expect(resume.filePath).toBe('/path/to/resume.pdf');
      expect(resume.fileType).toBe('application/pdf');
      expect(resume.uploadDate).toEqual(now);
      expect(resume.candidateId).toBeUndefined();

      jest.spyOn(global, 'Date').mockRestore();
    });
  });

  describe('save method', () => {
    it('should call prisma create when id is not provided', async () => {
      // Arrange
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);

      const resumeData = {
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
        candidateId: 1,
      };

      const mockCreatedResume = {
        id: 1,
        ...resumeData,
        uploadDate: now,
      };

      // Mock the create method to return the expected data
      prismaClient.resume.create.mockResolvedValue(mockCreatedResume);

      const resume = new Resume(resumeData);

      // Act
      const result = await resume.save();

      // Assert
      expect(prismaClient.resume.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          filePath: '/path/to/resume.pdf',
          fileType: 'application/pdf',
          candidateId: 1,
          uploadDate: now,
        }),
      });

      jest.spyOn(global, 'Date').mockRestore();
    });

    it('should still create when candidateId is missing', async () => {
      // Arrange
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);

      const resumeData = {
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
      };

      const mockCreatedResume = {
        id: 1,
        ...resumeData,
        candidateId: 1, // This will be added by the service layer in real use
        uploadDate: now,
      };

      prismaClient.resume.create.mockResolvedValue(mockCreatedResume);

      const resume = new Resume(resumeData);

      // Act
      const result = await resume.save();

      // Assert
      expect(prismaClient.resume.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          filePath: '/path/to/resume.pdf',
          fileType: 'application/pdf',
          uploadDate: now,
        }),
      });

      jest.spyOn(global, 'Date').mockRestore();
    });

    it('should throw error when trying to update existing resume', async () => {
      // Arrange
      const resumeData = {
        id: 1,
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
        candidateId: 1,
      };

      const resume = new Resume(resumeData);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow(
        'No se permite la actualización de un currículum existente.',
      );
    });

    it('should handle errors during save operation', async () => {
      // Arrange
      const resumeData = {
        filePath: '/path/to/resume.pdf',
        fileType: 'application/pdf',
        candidateId: 1,
      };

      const errorMessage = 'Database connection error';
      prismaClient.resume.create.mockRejectedValue(new Error(errorMessage));

      const resume = new Resume(resumeData);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow();
    });
  });
});
