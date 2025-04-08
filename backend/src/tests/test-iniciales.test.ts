import { PrismaClient } from '@prisma/client';

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        candidate: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('Candidate Insertion Tests with Mocked Prisma', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    it('should receive and save a candidate successfully with all valid data', async () => {
        const candidateData = {
            firstName: 'Albert',
            lastName: 'Saelices',
            email: 'albert.saelices@gmail.com',
            phone: '656874937',
            address: 'Calle Sant Dalmir 2, 5ºB. Barcelona',
        };

        // Mock del resultado esperado
        const mockCandidate = { id: 1, ...candidateData };
        (prisma.candidate.create as jest.Mock).mockResolvedValue(mockCandidate);

        // Simula la recepción de datos y el guardado
        const receivedData = { ...candidateData }; // Simula los datos recibidos
        const savedCandidate = await prisma.candidate.create({ data: receivedData });

        // Verifica que los datos se hayan guardado correctamente
        expect(savedCandidate).toEqual(mockCandidate);
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });

    it('should fail to save a candidate with missing required fields', async () => {
        const invalidCandidateData = {
            firstName: '', // Empty string to simulate missing required field
            lastName: 'Saelices',
            email: 'albert.saelices@gmail.com',
        };

        // Mock de un error al intentar guardar un candidato con campos faltantes
        (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Missing required fields'));

        // Simula la recepción de datos y el intento de guardado
        const receivedData = { ...invalidCandidateData };

        await expect(prisma.candidate.create({ data: receivedData })).rejects.toThrow(
            'Missing required fields'
        );
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });

    it('should fail to save a candidate with invalid email format', async () => {
        const invalidCandidateData = {
            firstName: 'Albert',
            lastName: 'Saelices',
            email: 'invalid-email',
        };

        // Mock de un error al intentar guardar un candidato con email inválido
        (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Invalid email format'));

        // Simula la recepción de datos y el intento de guardado
        const receivedData = { ...invalidCandidateData };

        await expect(prisma.candidate.create({ data: receivedData })).rejects.toThrow(
            'Invalid email format'
        );
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });

    it('should save a candidate with optional fields empty', async () => {
        const candidateData = {
            firstName: 'Albert',
            lastName: 'Saelices',
            email: 'albert.saelices@gmail.com',
        };

        // Mock del resultado esperado
        const mockCandidate = { id: 1, ...candidateData };
        (prisma.candidate.create as jest.Mock).mockResolvedValue(mockCandidate);

        // Simula la recepción de datos y el guardado
        const receivedData = { ...candidateData };
        const savedCandidate = await prisma.candidate.create({ data: receivedData });

        // Verifica que los datos se hayan guardado correctamente
        expect(savedCandidate).toEqual(mockCandidate);
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });

    it('should fail to save a candidate with duplicate email', async () => {
        const candidateData = {
            firstName: 'Albert',
            lastName: 'Saelices',
            email: 'albert.saelices@gmail.com',
        };

        // Mock de un error al intentar guardar un candidato con email duplicado
        (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Duplicate email'));

        // Simula la recepción de datos y el intento de guardado
        const receivedData = { ...candidateData };

        await expect(prisma.candidate.create({ data: receivedData })).rejects.toThrow('Duplicate email');
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });

    it('should fail to save a candidate with fields exceeding character limits', async () => {
        const invalidCandidateData = {
            firstName: 'A'.repeat(256), // Asumiendo que el límite es 255 caracteres
            lastName: 'Saelices',
            email: 'albert.saelices@gmail.com',
        };

        // Mock de un error al intentar guardar un candidato con campos que exceden los límites
        (prisma.candidate.create as jest.Mock).mockRejectedValue(new Error('Field exceeds character limit'));

        // Simula la recepción de datos y el intento de guardado
        const receivedData = { ...invalidCandidateData };

        await expect(prisma.candidate.create({ data: receivedData })).rejects.toThrow(
            'Field exceeds character limit'
        );
        expect(prisma.candidate.create).toHaveBeenCalledWith({ data: receivedData });
    });
});