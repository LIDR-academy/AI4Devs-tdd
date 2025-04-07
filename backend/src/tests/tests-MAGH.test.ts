import { PrismaClient, Prisma } from '@prisma/client';
import { Candidate } from '../domain/models/Candidate';
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        candidate: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn()
        },
        education: {
            create: jest.fn()
        },
        workExperience: {
            create: jest.fn()
        },
        resume: {
            create: jest.fn()
        }
    };
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
        Prisma: {
            PrismaClientInitializationError: class extends Error {
                constructor(message: string) {
                    super(message);
                    this.name = 'PrismaClientInitializationError';
                }
            }
        }
    };
});

describe('Candidate Insertion Tests', () => {
    let mockPrisma: any;

    beforeEach(() => {
        mockPrisma = new PrismaClient();
        jest.clearAllMocks();
    });

    describe('Data Validation Tests', () => {
        it('should validate correct candidate data', () => {
            const validCandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678',
                address: '123 Main St',
                educations: [{
                    institution: 'University of Test',
                    title: 'Bachelor of Science',
                    startDate: '2020-01-01',
                    endDate: '2024-01-01'
                }],
                workExperiences: [{
                    company: 'Test Corp',
                    position: 'Software Engineer',
                    description: 'Developing software',
                    startDate: '2024-01-01'
                }],
                cv: {
                    filePath: '/path/to/cv.pdf',
                    fileType: 'application/pdf'
                }
            };

            expect(() => validateCandidateData(validCandidateData)).not.toThrow();
        });

        it('should reject invalid email format', () => {
            const invalidCandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                phone: '612345678'
            };

            expect(() => validateCandidateData(invalidCandidateData)).toThrow('Invalid email');
        });

        it('should reject invalid phone number format', () => {
            const invalidCandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '123456789' // Invalid format
            };

            expect(() => validateCandidateData(invalidCandidateData)).toThrow('Invalid phone');
        });
    });

    describe('Database Operations Tests', () => {
        it('should successfully save a candidate to the database', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678'
            };

            const mockSavedCandidate = {
                id: 1,
                ...candidateData
            };

            (mockPrisma.candidate.create as jest.Mock).mockResolvedValue(mockSavedCandidate);

            const result = await addCandidate(candidateData);
            expect(result).toEqual(mockSavedCandidate);
            expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
                data: candidateData
            });
        });

        it('should handle database connection errors', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678'
            };

            const error = new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
            error.name = 'PrismaClientInitializationError';
            (mockPrisma.candidate.create as jest.Mock).mockRejectedValue(error);

            await expect(addCandidate(candidateData)).rejects.toThrow(
                'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
            );
        });

        it('should handle duplicate email errors', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678'
            };

            const error = new Error('The email already exists in the database') as any;
            error.code = 'P2002';
            (mockPrisma.candidate.create as jest.Mock).mockRejectedValue(error);

            await expect(addCandidate(candidateData)).rejects.toThrow(
                'The email already exists in the database'
            );
        });
    });
}); 