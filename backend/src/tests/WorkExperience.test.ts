import { WorkExperience } from '../domain/models/WorkExperience';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('WorkExperience Model', () => {
  let prismaClient: any;

  beforeEach(() => {
    // Get the mocked PrismaClient instance
    prismaClient = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new work experience instance with all properties', () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const endDate = new Date('2022-01-01');
      const workExperienceData = {
        company: 'Tech Company',
        position: 'Software Developer',
        description: 'Developing web applications',
        startDate: startDate,
        endDate: endDate,
        candidateId: 1,
      };

      // Act
      const workExperience = new WorkExperience(workExperienceData);

      // Assert
      expect(workExperience.company).toBe('Tech Company');
      expect(workExperience.position).toBe('Software Developer');
      expect(workExperience.description).toBe('Developing web applications');
      expect(workExperience.startDate).toEqual(startDate);
      expect(workExperience.endDate).toEqual(endDate);
      expect(workExperience.candidateId).toBe(1);
    });

    it('should create work experience instance with only required properties', () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const workExperienceData = {
        company: 'Tech Company',
        position: 'Software Developer',
        startDate: startDate,
      };

      // Act
      const workExperience = new WorkExperience(workExperienceData);

      // Assert
      expect(workExperience.company).toBe('Tech Company');
      expect(workExperience.position).toBe('Software Developer');
      expect(workExperience.startDate).toEqual(startDate);
      expect(workExperience.description).toBeUndefined();
      expect(workExperience.endDate).toBeUndefined();
      expect(workExperience.candidateId).toBeUndefined();
    });
  });

  describe('save method', () => {
    it('should call prisma create when id is not provided', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const workExperienceData = {
        company: 'Tech Company',
        position: 'Software Developer',
        description: 'Developing web applications',
        startDate: startDate,
        candidateId: 1,
      };

      const mockCreatedWorkExperience = {
        id: 1,
        ...workExperienceData,
      };

      prismaClient.workExperience.create.mockResolvedValue(
        mockCreatedWorkExperience,
      );

      const workExperience = new WorkExperience(workExperienceData);

      // Act
      const result = await workExperience.save();

      // Assert
      expect(prismaClient.workExperience.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          company: 'Tech Company',
          position: 'Software Developer',
          description: 'Developing web applications',
          candidateId: 1,
        }),
      });
      expect(result).toEqual(mockCreatedWorkExperience);
    });

    it('should still create when candidateId is missing', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const workExperienceData = {
        company: 'Tech Company',
        position: 'Software Developer',
        description: 'Developing web applications',
        startDate: startDate,
      };

      const mockCreatedWorkExperience = {
        id: 1,
        ...workExperienceData,
        candidateId: 1, // This will be added by the service layer in real use
      };

      prismaClient.workExperience.create.mockResolvedValue(
        mockCreatedWorkExperience,
      );

      const workExperience = new WorkExperience(workExperienceData);

      // Act
      const result = await workExperience.save();

      // Assert
      expect(prismaClient.workExperience.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          company: 'Tech Company',
          position: 'Software Developer',
          description: 'Developing web applications',
        }),
      });
      expect(result).toEqual(mockCreatedWorkExperience);
    });

    it('should call prisma update when id is provided', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const workExperienceData = {
        id: 1,
        company: 'Tech Company',
        position: 'Software Developer',
        description: 'Developing web applications',
        startDate: startDate,
        candidateId: 1,
      };

      const mockUpdatedWorkExperience = {
        ...workExperienceData,
      };

      prismaClient.workExperience.update.mockResolvedValue(
        mockUpdatedWorkExperience,
      );

      const workExperience = new WorkExperience(workExperienceData);

      // Act
      const result = await workExperience.save();

      // Assert
      expect(prismaClient.workExperience.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          company: 'Tech Company',
          position: 'Software Developer',
          description: 'Developing web applications',
        }),
      });
      expect(result).toEqual(mockUpdatedWorkExperience);
    });

    it('should handle errors during save operation', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const workExperienceData = {
        company: 'Tech Company',
        position: 'Software Developer',
        description: 'Developing web applications',
        startDate: startDate,
        candidateId: 1,
      };

      const errorMessage = 'Database connection error';
      prismaClient.workExperience.create.mockRejectedValue(
        new Error(errorMessage),
      );

      const workExperience = new WorkExperience(workExperienceData);

      // Act & Assert
      await expect(workExperience.save()).rejects.toThrow(errorMessage);
    });
  });
});
