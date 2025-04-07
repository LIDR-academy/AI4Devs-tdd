import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prismaMock = mockDeep<PrismaClient>();

// Añadir esta línea para mockear $connect
prismaMock.$connect.mockResolvedValue();

export { prismaMock, mockReset };