import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      // Aquí añadiremos los mocks necesarios para Prisma cuando los necesitemos
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});