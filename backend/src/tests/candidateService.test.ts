import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            candidate: {
                create: jest.fn(),
                findUnique: jest.fn(),
            },
            education: {
                create: jest.fn(),
            },
            workExperience: {
                create: jest.fn(),
            },
            resume: {
                create: jest.fn(),
            },
        })),
    };
});

// Mock de los modelos con implementación del método save()
jest.mock('../domain/models/Candidate', () => {
    return {
        Candidate: jest.fn().mockImplementation((data) => ({
            ...data,
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockImplementation(async () => ({
                id: 1,
                ...data
            }))
        }))
    };
});

jest.mock('../domain/models/Education', () => {
    return {
        Education: jest.fn().mockImplementation((data) => ({
            ...data,
            save: jest.fn().mockImplementation(async () => ({
                id: 1,
                ...data
            }))
        }))
    };
});

jest.mock('../domain/models/WorkExperience', () => {
    return {
        WorkExperience: jest.fn().mockImplementation((data) => ({
            ...data,
            save: jest.fn().mockImplementation(async () => ({
                id: 1,
                ...data
            }))
        }))
    };
});

jest.mock('../domain/models/Resume', () => {
    return {
        Resume: jest.fn().mockImplementation((data) => ({
            ...data,
            save: jest.fn().mockImplementation(async () => ({
                id: 1,
                ...data
            }))
        }))
    };
});

describe('CandidateService', () => {
    let prisma: PrismaClient;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new PrismaClient();
    });

    describe('addCandidate', () => {
        it('debería insertar un candidato exitosamente', async () => {
            // Datos de prueba válidos
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
                educations: [{
                    institution: 'Universidad de Prueba',
                    title: 'Ingeniería Informática',
                    startDate: '2020-01-01',
                    endDate: '2024-01-01'
                }],
                workExperiences: [{
                    company: 'Empresa XYZ',
                    position: 'Desarrollador',
                    description: 'Desarrollo de aplicaciones web',
                    startDate: '2024-01-01'
                }],
                cv: {
                    filePath: '/uploads/cv.pdf',
                    fileType: 'application/pdf'
                }
            };

            const result = await addCandidate(candidateData);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(Candidate).toHaveBeenCalledWith(candidateData);
            expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
            expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
            expect(Resume).toHaveBeenCalledWith(candidateData.cv);
        });

        it('debería lanzar error con datos inválidos', async () => {
            const invalidData = {
                firstName: 'J', // Nombre muy corto
                lastName: 'Pérez',
                email: 'email-invalido',
                phone: '123', // Teléfono inválido
                address: 'Calle Principal 123'
            };

            await expect(addCandidate(invalidData)).rejects.toThrow();
        });

        it('debería manejar correctamente el error de email duplicado', async () => {
            const candidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                phone: '612345678'
            };

            // Mock del error de email duplicado en el método save del Candidate
            const mockCandidate = {
                ...candidateData,
                education: [],
                workExperience: [],
                resumes: [],
                save: jest.fn().mockRejectedValue({
                    code: 'P2002',
                    message: 'Unique constraint failed on the fields: (`email`)'
                })
            };

            (Candidate as unknown as jest.Mock).mockImplementationOnce(() => mockCandidate);

            await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
        });

        it('debería insertar un candidato sin datos opcionales', async () => {
            const minimalData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com'
            };

            const result = await addCandidate(minimalData);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(Candidate).toHaveBeenCalledWith(minimalData);
        });
    });
}); 