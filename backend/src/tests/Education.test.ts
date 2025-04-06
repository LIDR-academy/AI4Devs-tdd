import { Education } from '../domain/models/Education';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('Education Model', () => {
  let prismaClient: any;

  beforeEach(() => {
    // Get the mocked PrismaClient instance
    prismaClient = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new education instance with all properties', () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const endDate = new Date('2022-01-01');
      const educationData = {
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
        endDate: endDate,
        candidateId: 1,
      };

      // Act
      const education = new Education(educationData);

      // Assert
      expect(education.institution).toBe('University of Example');
      expect(education.title).toBe('Computer Science');
      expect(education.startDate).toEqual(startDate);
      expect(education.endDate).toEqual(endDate);
      expect(education.candidateId).toBe(1);
    });

    it('should create education instance with only required properties', () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const educationData = {
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
      };

      // Act
      const education = new Education(educationData);

      // Assert
      expect(education.institution).toBe('University of Example');
      expect(education.title).toBe('Computer Science');
      expect(education.startDate).toEqual(startDate);
      expect(education.endDate).toBeUndefined();
      expect(education.candidateId).toBeUndefined();
    });
  });

  describe('save method', () => {
    it('should call prisma create when id is not provided', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const educationData = {
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
        candidateId: 1,
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
      };

      prismaClient.education.create.mockResolvedValue(mockCreatedEducation);

      const education = new Education(educationData);

      // Act
      const result = await education.save();

      // Assert
      expect(prismaClient.education.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          institution: 'University of Example',
          title: 'Computer Science',
          candidateId: 1,
        }),
      });
      expect(result).toEqual(mockCreatedEducation);
    });

    it('should still create when candidateId is missing', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const educationData = {
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        candidateId: 1, // This will be added by the service layer in real use
      };

      prismaClient.education.create.mockResolvedValue(mockCreatedEducation);

      const education = new Education(educationData);

      // Act
      const result = await education.save();

      // Assert
      expect(prismaClient.education.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          institution: 'University of Example',
          title: 'Computer Science',
        }),
      });
      expect(result).toEqual(mockCreatedEducation);
    });

    it('should call prisma update when id is provided', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const educationData = {
        id: 1,
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
        candidateId: 1,
      };

      const mockUpdatedEducation = {
        ...educationData,
      };

      prismaClient.education.update.mockResolvedValue(mockUpdatedEducation);

      const education = new Education(educationData);

      // Act
      const result = await education.save();

      // Assert
      expect(prismaClient.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          institution: 'University of Example',
          title: 'Computer Science',
        }),
      });
      expect(result).toEqual(mockUpdatedEducation);
    });

    it('should handle errors during save operation', async () => {
      // Arrange
      const startDate = new Date('2018-01-01');
      const educationData = {
        institution: 'University of Example',
        title: 'Computer Science',
        startDate: startDate,
        candidateId: 1,
      };

      const errorMessage = 'Database connection error';
      prismaClient.education.create.mockRejectedValue(new Error(errorMessage));

      const education = new Education(educationData);

      // Act & Assert
      await expect(education.save()).rejects.toThrow(errorMessage);
    });
  });
});
