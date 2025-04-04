import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Mock do PrismaClient para testes
jest.mock('@prisma/client', () => {
  const mockDisconnect = jest.fn().mockResolvedValue(undefined);
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $disconnect: mockDisconnect
    }))
  };
});

// Mock do app Express
jest.mock('../index', () => {
  const originalModule = jest.requireActual('../index');
  const mockServer = {
    close: jest.fn().mockImplementation(cb => cb && cb())
  };
  const mockListen = jest.fn().mockReturnValue(mockServer);
  
  return {
    ...originalModule,
    app: {
      ...originalModule.app,
      listen: mockListen
    }
  };
});

const prisma = new PrismaClient();

// Configuração para garantir que o timeout é suficientemente longo
jest.setTimeout(30000);

// Configuração para silenciar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Ensure test uploads directory exists
const testUploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(testUploadsDir)) {
  fs.mkdirSync(testUploadsDir, { recursive: true });
}

// Desconexão do Prisma após todos os testes
afterAll(async () => {
  await prisma.$disconnect();
  jest.clearAllMocks();
  jest.resetModules();
}); 