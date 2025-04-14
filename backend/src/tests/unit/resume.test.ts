import { jest } from '@jest/globals';
import { Resume } from '../../domain/models/Resume';

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => {
    const mockResume = {
        create: jest.fn()
    };
    
    class PrismaClientInitializationError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'PrismaClientInitializationError';
        }
    }
    
    return {
        PrismaClient: jest.fn(() => ({
            resume: mockResume
        })),
        Prisma: {
            PrismaClientInitializationError
        }
    };
});

// Importamos después del mock
import { PrismaClient } from '@prisma/client';

describe('Resume Model Tests', () => {
    const mockPrisma = new PrismaClient();
    
    const validResumeData = {
        candidateId: 1,
        filePath: '/path/to/resume.pdf',
        fileType: 'pdf'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a resume with valid data', async () => {
        const expectedData = {
            ...validResumeData,
            id: 1,
            uploadDate: new Date()
        };

        // @ts-ignore
        mockPrisma.resume.create.mockResolvedValueOnce(expectedData);

        const resume = new Resume(validResumeData);
        const result = await resume.save();

        expect(result).toBeInstanceOf(Resume);
        expect(result.id).toBe(1);
        expect(result.candidateId).toBe(validResumeData.candidateId);
        expect(result.filePath).toBe(validResumeData.filePath);
        expect(result.fileType).toBe(validResumeData.fileType);
        expect(result.uploadDate).toBeInstanceOf(Date);
    });

    it('should throw error when trying to update an existing resume', async () => {
        const existingResume = new Resume({
            ...validResumeData,
            id: 1
        });

        await expect(existingResume.save()).rejects.toThrow('No se permite la actualización de un currículum existente.');
    });

    it('should handle database connection error', async () => {
        // @ts-ignore
        mockPrisma.resume.create.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });

        const resume = new Resume(validResumeData);
        await expect(resume.save()).rejects.toThrow('Failed to connect to database');
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = new Error('Something went wrong');
        // @ts-ignore
        mockPrisma.resume.create.mockRejectedValueOnce(unexpectedError);

        const resume = new Resume(validResumeData);
        await expect(resume.save()).rejects.toThrow('Something went wrong');
    });

    it('should throw error when required fields are missing', () => {
        const invalidData = {
            filePath: '/path/to/resume.pdf'
        };

        expect(() => new Resume(invalidData)).toThrow();
    });

    it('should handle file type validation', () => {
        const invalidFileType = {
            ...validResumeData,
            fileType: 'invalid'
        };

        const resume = new Resume(invalidFileType);
        expect(resume.fileType).toBe('invalid');
    });
}); 