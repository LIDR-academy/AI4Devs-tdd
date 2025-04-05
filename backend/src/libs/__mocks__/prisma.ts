import { PrismaClient } from '@prisma/client';
import { vi } from 'vitest';

const prisma = {
  // Aquí añadiremos los mocks para cada modelo que necesitemos
  candidate: {
    create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  education: {
    create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
    findMany: vi.fn(),
  },
  workExperience: {
    create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data.data })),
    findMany: vi.fn(),
  },
  resume: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  // Añadir cualquier otro modelo que necesites mockear
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn().mockImplementation(async (callback) => {
    if (typeof callback === 'function') {
      return callback(prisma);
    }
    return { id: 1 };
  }),
} as unknown as PrismaClient;

// Limpiar todos los mocks después de cada test
afterEach(() => {
  vi.clearAllMocks();
});

export default prisma;