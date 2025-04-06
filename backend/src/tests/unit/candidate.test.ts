import { jest } from '@jest/globals';
import { Candidate } from '../../domain/models/Candidate';

// Crear un mock completo del módulo @prisma/client
jest.mock('@prisma/client', () => {
    const mockCandidate = {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn()
    };
    
    class PrismaClientInitializationError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'PrismaClientInitializationError';
        }
    }
    
    return {
        PrismaClient: jest.fn(() => ({
            candidate: mockCandidate
        })),
        Prisma: {
            PrismaClientInitializationError
        }
    };
});

// Después de mockear, importamos para acceder a los mocks
import { PrismaClient, Prisma } from '@prisma/client';

describe('Candidate Model Tests', () => {
    // Instanciamos para acceder a los métodos mock
    const mockPrisma = new PrismaClient();
    
    const validCandidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a candidate with valid data', async () => {
        // @ts-ignore
        mockPrisma.candidate.create.mockResolvedValueOnce({
            ...validCandidateData,
            id: 1,
            education: [],
            workExperience: [],
            resumes: []
        });

        const candidate = new Candidate(validCandidateData);
        const result = await candidate.save();

        expect(result).toEqual({
            ...validCandidateData,
            id: 1,
            education: [],
            workExperience: [],
            resumes: []
        });
    });

    it('should create a candidate with relationships', async () => {
        const candidateData = {
            ...validCandidateData,
            education: [
                { institution: 'University', title: 'Degree', startDate: '2020-01-01', endDate: '2024-01-01' }
            ],
            workExperience: [
                { company: 'Company', position: 'Position', startDate: '2020-01-01', endDate: '2024-01-01' }
            ],
            resumes: [
                { filePath: '/path/to/resume.pdf', fileType: 'pdf' }
            ]
        };

        // @ts-ignore
        mockPrisma.candidate.create.mockResolvedValueOnce({
            ...candidateData,
            id: 1
        });

        const candidate = new Candidate(candidateData);
        const result = await candidate.save();

        expect(result).toEqual({
            ...candidateData,
            id: 1
        });
        expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
            data: {
                ...validCandidateData,
                educations: {
                    create: candidateData.education
                },
                workExperiences: {
                    create: candidateData.workExperience
                },
                resumes: {
                    create: candidateData.resumes
                }
            }
        });
    });

    it('should handle optional fields', () => {
        const minimalData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        };

        const candidate = new Candidate(minimalData);
        expect(candidate.phone).toBeUndefined();
        expect(candidate.address).toBeUndefined();
    });

    it('should initialize arrays as empty if not provided', () => {
        const candidate = new Candidate(validCandidateData);
        expect(candidate.education).toEqual([]);
        expect(candidate.workExperience).toEqual([]);
        expect(candidate.resumes).toEqual([]);
    });

    it('should find a candidate by id', async () => {
        const mockData = {
            ...validCandidateData,
            id: 1,
            education: [],
            workExperience: [],
            resumes: []
        };
        // @ts-ignore
        mockPrisma.candidate.findUnique.mockResolvedValueOnce(mockData);

        const result = await Candidate.findOne(1);
        expect(result).toBeInstanceOf(Candidate);
        expect(result?.id).toBe(1);
    });

    it('should handle database error in findOne', async () => {
        // @ts-ignore
        mockPrisma.candidate.findUnique.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });

        await expect(Candidate.findOne(1)).rejects.toThrow('No se pudo conectar con la base de datos');
    });

    it('should handle duplicate email error', async () => {
        // @ts-ignore
        mockPrisma.candidate.create.mockRejectedValueOnce({
            code: 'P2002',
            name: 'PrismaClientKnownRequestError',
            message: 'Unique constraint failed on the fields: (`email`)'
        });
        
        const candidate = new Candidate(validCandidateData);
        await expect(candidate.save()).rejects.toThrow('The email already exists in the database');
    });

    it('should handle record not found error', async () => {
        // @ts-ignore
        mockPrisma.candidate.update.mockRejectedValueOnce({
            code: 'P2025',
            name: 'PrismaClientKnownRequestError',
            message: 'Record not found'
        });
        
        const candidate = new Candidate({ ...validCandidateData, id: 1 });
        await expect(candidate.save()).rejects.toThrow('No se pudo encontrar el registro del candidato con el ID proporcionado.');
    });

    it('should handle database connection error', async () => {
        // @ts-ignore
        mockPrisma.candidate.create.mockRejectedValueOnce({
            name: 'PrismaClientInitializationError',
            message: 'Failed to connect to database'
        });
        
        const candidate = new Candidate(validCandidateData);
        await expect(candidate.save()).rejects.toThrow('No se pudo conectar con la base de datos');
    });

    it('should update an existing candidate', async () => {
        const updatedData = {
            ...validCandidateData,
            id: 1,
            firstName: 'Jane',
            education: [],
            workExperience: [],
            resumes: []
        };
        // @ts-ignore
        mockPrisma.candidate.update.mockResolvedValueOnce(updatedData);

        const candidate = new Candidate({ ...validCandidateData, id: 1, firstName: 'Jane' });
        const result = await candidate.save();

        expect(result.firstName).toBe('Jane');
        expect(mockPrisma.candidate.update).toHaveBeenCalled();
    });

    it('should update a candidate with relationships', async () => {
        const updatedData = {
            ...validCandidateData,
            id: 1,
            firstName: 'Jane',
            education: [
                { institution: 'New University', title: 'New Degree', startDate: '2020-01-01', endDate: '2024-01-01' }
            ],
            workExperience: [
                { company: 'New Company', position: 'New Position', startDate: '2020-01-01', endDate: '2024-01-01' }
            ],
            resumes: [
                { filePath: '/path/to/new/resume.pdf', fileType: 'pdf' }
            ]
        };

        // @ts-ignore
        mockPrisma.candidate.update.mockResolvedValueOnce(updatedData);

        const candidate = new Candidate(updatedData);
        const result = await candidate.save();

        expect(result.firstName).toBe('Jane');
        expect(mockPrisma.candidate.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                ...validCandidateData,
                firstName: 'Jane',
                educations: {
                    create: updatedData.education
                },
                workExperiences: {
                    create: updatedData.workExperience
                },
                resumes: {
                    create: updatedData.resumes
                }
            }
        });
    });

    it('should return null when finding non-existent candidate', async () => {
        // @ts-ignore
        mockPrisma.candidate.findUnique.mockResolvedValueOnce(null);

        const result = await Candidate.findOne(999);
        expect(result).toBeNull();
    });

    it('should handle unexpected errors', async () => {
        const unexpectedError = new Error('Unexpected error');
        // @ts-ignore
        mockPrisma.candidate.create.mockRejectedValueOnce(unexpectedError);
        
        const candidate = new Candidate(validCandidateData);
        await expect(candidate.save()).rejects.toThrow('Unexpected error');
    });

    it('should handle unexpected errors during update', async () => {
        const unexpectedError = new Error('Unexpected update error');
        // @ts-ignore
        mockPrisma.candidate.update.mockRejectedValueOnce(unexpectedError);
        
        const candidate = new Candidate({ ...validCandidateData, id: 1 });
        await expect(candidate.save()).rejects.toThrow('Unexpected update error');
    });

    it('should handle unexpected errors in findOne', async () => {
        const unexpectedError = new Error('Unexpected findOne error');
        // @ts-ignore
        mockPrisma.candidate.findUnique.mockRejectedValueOnce(unexpectedError);
        
        await expect(Candidate.findOne(1)).rejects.toThrow('Unexpected findOne error');
    });
}); 