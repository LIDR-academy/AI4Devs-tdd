import { jest } from '@jest/globals';
import { Education } from '../../domain/models/Education';

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => {
    const mockEducation = {
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
            education: mockEducation
        })),
        Prisma: {
            PrismaClientInitializationError
        }
    };
});

// Importamos después del mock
import { PrismaClient } from '@prisma/client';

describe('Education Model Tests', () => {
    const mockPrisma = new PrismaClient();
    
    const validEducationData = {
        institution: 'Universidad ABC',
        title: 'Ingeniería en Sistemas',
        startDate: '2020-01-01',
        endDate: '2024-01-01'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an education record with valid data', async () => {
        const expectedData = {
            ...validEducationData,
            id: 1,
            startDate: new Date(validEducationData.startDate),
            endDate: new Date(validEducationData.endDate)
        };

        // @ts-ignore
        mockPrisma.education.create.mockResolvedValueOnce(expectedData);

        const education = new Education(validEducationData);
        const result = await education.save();

        expect(result).toEqual(expectedData);
        expect(mockPrisma.education.create).toHaveBeenCalledWith({
            data: {
                institution: validEducationData.institution,
                title: validEducationData.title,
                startDate: new Date(validEducationData.startDate),
                endDate: new Date(validEducationData.endDate)
            }
        });
    });

    it('should create an education record without end date', async () => {
        const dataWithoutEndDate = {
            institution: 'Universidad ABC',
            title: 'Ingeniería en Sistemas',
            startDate: '2020-01-01'
        };

        const expectedData = {
            ...dataWithoutEndDate,
            id: 1,
            startDate: new Date(dataWithoutEndDate.startDate),
            endDate: undefined
        };

        // @ts-ignore
        mockPrisma.education.create.mockResolvedValueOnce(expectedData);

        const education = new Education(dataWithoutEndDate);
        const result = await education.save();

        expect(result).toEqual(expectedData);
        expect(education.endDate).toBeUndefined();
    });

    it('should create an education record with candidateId', async () => {
        const dataWithCandidate = {
            ...validEducationData,
            candidateId: 1
        };

        const expectedData = {
            ...dataWithCandidate,
            id: 1,
            startDate: new Date(validEducationData.startDate),
            endDate: new Date(validEducationData.endDate)
        };

        // @ts-ignore
        mockPrisma.education.create.mockResolvedValueOnce(expectedData);

        const education = new Education(dataWithCandidate);
        const result = await education.save();

        expect(result).toEqual(expectedData);
        expect(mockPrisma.education.create).toHaveBeenCalledWith({
            data: {
                institution: validEducationData.institution,
                title: validEducationData.title,
                startDate: new Date(validEducationData.startDate),
                endDate: new Date(validEducationData.endDate),
                candidateId: 1
            }
        });
    });

    it('should update an existing education record', async () => {
        const existingEducation = {
            ...validEducationData,
            id: 1,
            startDate: new Date(validEducationData.startDate),
            endDate: new Date(validEducationData.endDate)
        };

        const updatedData = {
            ...existingEducation,
            title: 'Ingeniería en Software'
        };

        // @ts-ignore
        mockPrisma.education.update.mockResolvedValueOnce(updatedData);

        const education = new Education(updatedData);
        const result = await education.save();

        expect(result).toEqual(updatedData);
        expect(mockPrisma.education.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                institution: updatedData.institution,
                title: updatedData.title,
                startDate: updatedData.startDate,
                endDate: updatedData.endDate
            }
        });
    });

    it('should handle database connection error during create', async () => {
        // @ts-ignore
        mockPrisma.education.create.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });

        const education = new Education(validEducationData);
        await expect(education.save()).rejects.toThrow('Failed to connect to database');
    });

    it('should handle database connection error during update', async () => {
        // @ts-ignore
        mockPrisma.education.update.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });

        const education = new Education({ ...validEducationData, id: 1 });
        await expect(education.save()).rejects.toThrow('Failed to connect to database');
    });

    it('should handle record not found error during update', async () => {
        // @ts-ignore
        mockPrisma.education.update.mockRejectedValueOnce({
            code: 'P2025',
            name: 'PrismaClientKnownRequestError',
            message: 'Record not found'
        });

        const education = new Education({ ...validEducationData, id: 999 });
        await expect(education.save()).rejects.toThrow('Record not found');
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = new Error('Something went wrong');
        // @ts-ignore
        mockPrisma.education.create.mockRejectedValueOnce(unexpectedError);

        const education = new Education(validEducationData);
        await expect(education.save()).rejects.toThrow('Something went wrong');
    });
}); 