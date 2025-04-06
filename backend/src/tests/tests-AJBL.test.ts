import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';

// Mock del cliente Prisma
const prismaMock = mockDeep<PrismaClient>();

// Mock de la clase Candidate
jest.mock('../domain/models/Candidate', () => {
    return {
        Candidate: jest.fn().mockImplementation((data) => ({
            ...data,
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockImplementation(async () => {
                const result = await prismaMock.candidate.create({
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone || null,
                        address: data.address || null
                    }
                });
                return result;
            })
        }))
    };
});

// Mock del validador
jest.mock('../application/validator', () => ({
    validateCandidateData: jest.fn().mockImplementation(() => {
        // Por defecto, no lanza error
        return true;
    })
}));

describe('Recepción de Nuevo Candidato', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.candidate.create.mockClear();
    });

    it('debería validar y procesar correctamente los datos del candidato', async () => {
        // Arrange
        const candidateData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone: '612345678',
            address: 'Calle Principal 123',
            educations: [{
                institution: 'Universidad Test',
                title: 'Ingeniería',
                startDate: '2020-01-01',
                endDate: '2024-01-01'
            }],
            workExperiences: [{
                company: 'Empresa Test',
                position: 'Desarrollador',
                startDate: '2024-01-01'
            }]
        };

        const expectedResult = {
            id: 1,
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email,
            phone: candidateData.phone,
            address: candidateData.address
        };

        prismaMock.candidate.create.mockResolvedValueOnce(expectedResult);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
        expect(prismaMock.candidate.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toMatchObject(expectedResult);
    });

    it('debería manejar errores de validación', async () => {
        // Arrange
        const invalidData = {
            firstName: 'J',
            email: 'invalid-email'
        };

        (validateCandidateData as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Datos inválidos');
        });

        // Act & Assert
        await expect(addCandidate(invalidData)).rejects.toThrow('Datos inválidos');
    });

    it('debería manejar candidatos sin datos opcionales', async () => {
        // Arrange
        const minimalData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com'
        };

        const expectedResult = {
            id: 1,
            firstName: minimalData.firstName,
            lastName: minimalData.lastName,
            email: minimalData.email,
            phone: null,
            address: null
        };

        prismaMock.candidate.create.mockResolvedValueOnce(expectedResult);

        // Act
        const result = await addCandidate(minimalData);

        // Assert
        expect(validateCandidateData).toHaveBeenCalledWith(minimalData);
        expect(prismaMock.candidate.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toMatchObject(expectedResult);
    });

    it('debería manejar candidatos con solo educación', async () => {
        // Arrange
        const dataWithEducation = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            educations: [{
                institution: 'Universidad Test',
                title: 'Ingeniería',
                startDate: '2020-01-01'
            }]
        };

        const expectedResult = {
            id: 1,
            firstName: dataWithEducation.firstName,
            lastName: dataWithEducation.lastName,
            email: dataWithEducation.email,
            phone: null,
            address: null
        };

        prismaMock.candidate.create.mockResolvedValueOnce(expectedResult);

        // Act
        const result = await addCandidate(dataWithEducation);

        // Assert
        expect(validateCandidateData).toHaveBeenCalledWith(dataWithEducation);
        expect(prismaMock.candidate.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toMatchObject(expectedResult);
    });

    it('debería manejar candidatos con solo experiencia laboral', async () => {
        // Arrange
        const dataWithExperience = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            workExperiences: [{
                company: 'Empresa Test',
                position: 'Desarrollador',
                startDate: '2024-01-01'
            }]
        };

        const expectedResult = {
            id: 1,
            firstName: dataWithExperience.firstName,
            lastName: dataWithExperience.lastName,
            email: dataWithExperience.email,
            phone: null,
            address: null
        };

        prismaMock.candidate.create.mockResolvedValueOnce(expectedResult);

        // Act
        const result = await addCandidate(dataWithExperience);

        // Assert
        expect(validateCandidateData).toHaveBeenCalledWith(dataWithExperience);
        expect(prismaMock.candidate.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toMatchObject(expectedResult);
    });
});

describe('Añadir Candidato a Base de Datos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.candidate.create.mockClear();
    });

    it('debería guardar correctamente un nuevo candidato', async () => {
        // Arrange
        const candidateData = {
            firstName: 'Ana',
            lastName: 'García',
            email: 'ana@example.com',
            phone: '612345678'
        };

        const expectedResult = {
            id: 1,
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email,
            phone: candidateData.phone,
            address: null
        };

        prismaMock.candidate.create.mockResolvedValueOnce(expectedResult);

        // Act
        const result = await addCandidate(candidateData);

        // Assert
        expect(prismaMock.candidate.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id', 1);
        expect(result).toMatchObject(expectedResult);
    });

    it('debería manejar errores de base de datos', async () => {
        // Arrange
        const candidateData = {
            firstName: 'Ana',
            lastName: 'García',
            email: 'ana@example.com'
        };

        prismaMock.candidate.create.mockRejectedValueOnce(new Error('Error de base de datos'));

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('Error de base de datos');
    });

    it('debería manejar errores de duplicado de email', async () => {
        // Arrange
        const candidateData = {
            firstName: 'Ana',
            lastName: 'García',
            email: 'ana@example.com'
        };

        prismaMock.candidate.create.mockRejectedValueOnce(new Error('The email already exists in the database'));

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    it('debería manejar errores de conexión a la base de datos', async () => {
        // Arrange
        const candidateData = {
            firstName: 'Ana',
            lastName: 'García',
            email: 'ana@example.com'
        };

        prismaMock.candidate.create.mockRejectedValueOnce(new Error('No se pudo conectar con la base de datos'));

        // Act & Assert
        await expect(addCandidate(candidateData)).rejects.toThrow('No se pudo conectar con la base de datos');
    });
});
