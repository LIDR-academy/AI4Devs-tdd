import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

// Mock global de Prisma
jest.mock('@prisma/client', () => {
    const mockPrisma = mockDeep<PrismaClient>();
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

// Configuración global de Jest
beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
}); 