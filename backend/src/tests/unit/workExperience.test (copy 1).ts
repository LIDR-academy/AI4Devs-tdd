import { jest } from '@jest/globals';
import { WorkExperience } from '../../domain/models/WorkExperience';

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => {
    const mockWorkExperience = {
        create: jest.fn(),
        update: jest.fn()
    };
    
    class PrismaClientInitializationError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'PrismaClientInitializationError';
        }
    }
    
    return {
        PrismaClient: jest.fn(() => ({
            workExperience: mockWorkExperience
        })),
        Prisma: {
            PrismaClientInitializationError
        }
    };
});

// Importamos después del mock
import { PrismaClient } from '@prisma/client';

describe('WorkExperience Model Tests', () => {
    const mockPrisma = new PrismaClient();
    
    const validWorkExperienceData = {
        company: 'Tech Corp',
        position: 'Senior Developer',
        description: 'Desarrollo de aplicaciones web',
        startDate: '2020-01-01',
        candidateId: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a work experience with valid data', async () => {
        const expectedData = {
            ...validWorkExperienceData,
            id: 1,
            startDate: new Date(validWorkExperienceData.startDate)
        };

        // @ts-ignore
        mockPrisma.workExperience.create.mockResolvedValueOnce(expectedData);

        const workExperience = new WorkExperience(validWorkExperienceData);
        const result = await workExperience.save();

        expect(result).toBeInstanceOf(WorkExperience);
        expect(result.id).toBe(1);
        expect(result.company).toBe(validWorkExperienceData.company);
        expect(result.position).toBe(validWorkExperienceData.position);
        expect(result.description).toBe(validWorkExperienceData.description);
        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.candidateId).toBe(validWorkExperienceData.candidateId);
    });

    it('should update an existing work experience', async () => {
        const updateData = {
            ...validWorkExperienceData,
            id: 1,
            position: 'Lead Developer'
        };

        // @ts-ignore
        mockPrisma.workExperience.update.mockResolvedValueOnce(updateData);

        const workExperience = new WorkExperience(updateData);
        const result = await workExperience.save();

        expect(result.position).toBe('Lead Developer');
        expect(mockPrisma.workExperience.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                company: updateData.company,
                position: updateData.position,
                description: updateData.description,
                startDate: new Date(updateData.startDate),
                candidateId: updateData.candidateId
            }
        });
    });

    it('should handle database connection error', async () => {
        // @ts-ignore
        mockPrisma.workExperience.create.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });

        const workExperience = new WorkExperience(validWorkExperienceData);
        await expect(workExperience.save()).rejects.toThrow('Failed to connect to database');
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = new Error('Something went wrong');
        // @ts-ignore
        mockPrisma.workExperience.create.mockRejectedValueOnce(unexpectedError);

        const workExperience = new WorkExperience(validWorkExperienceData);
        await expect(workExperience.save()).rejects.toThrow('Something went wrong');
    });

    it('should handle optional fields', () => {
        const minimalData = {
            company: 'Tech Corp',
            position: 'Developer',
            startDate: '2020-01-01'
        };

        const workExperience = new WorkExperience(minimalData);
        expect(workExperience.description).toBeUndefined();
        expect(workExperience.endDate).toBeUndefined();
        expect(workExperience.candidateId).toBeUndefined();
    });

    it('should handle endDate when provided', () => {
        const dataWithEndDate = {
            ...validWorkExperienceData,
            endDate: '2023-12-31'
        };

        const workExperience = new WorkExperience(dataWithEndDate);
        expect(workExperience.endDate).toBeInstanceOf(Date);
        expect(workExperience.endDate?.toISOString().split('T')[0]).toBe('2023-12-31');
    });

    it('should throw error when required fields are missing', () => {
        const invalidData = {
            company: 'Tech Corp'
            // Falta position y startDate
        };

        expect(() => new WorkExperience(invalidData)).toThrow();
    });
}); 