export class PrismaClientInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaClientInitializationError';
  }
}

export const mockPrisma = {
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  })),
  Prisma: {
    PrismaClientInitializationError: PrismaClientInitializationError
  }
};

// Mock para errores de Prisma
export const createPrismaConnectionError = () => {
  return new PrismaClientInitializationError('Error de conexión');
};

export const createPrismaRecordNotFoundError = () => {
  return {
    code: 'P2025',
    message: 'Record to update not found.'
  };
}; 