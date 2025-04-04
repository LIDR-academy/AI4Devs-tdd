import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * Cria um mock do Request do Express
 */
export const mockRequest = () => {
  const req: Partial<Request> = {
    body: {},
    file: undefined,
    params: {}
  };
  return req as Request;
};

/**
 * Cria um mock do Response do Express
 */
export const mockResponse = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return res as Response;
};

/**
 * Fixtures para dados de teste de candidatos
 */
export const testCandidateData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNumber: '1234567890',
  education: 'Bachelor',
  workExperience: '5 years'
};

/**
 * Cria um mock de resposta de um candidato completo
 */
export const mockCandidateResponse = {
  id: 1,
  ...testCandidateData,
  address: null,
  cvUrl: '/uploads/test-file.pdf',
  createdAt: new Date(),
  updatedAt: new Date()
};

/**
 * Configura o mock do PrismaClient para testes
 */
export const setupPrismaMock = () => {
  // Mock do PrismaClient
  jest.mock('@prisma/client', () => {
    const mockCreate = jest.fn();
    const mockDeleteMany = jest.fn();
    const mockFindMany = jest.fn();
    const mockFindUnique = jest.fn();
    const mockDisconnect = jest.fn();
    
    return {
      PrismaClient: jest.fn().mockImplementation(() => ({
        candidate: {
          create: mockCreate,
          deleteMany: mockDeleteMany,
          findMany: mockFindMany,
          findUnique: mockFindUnique
        },
        $disconnect: mockDisconnect
      }))
    };
  });
  
  return new PrismaClient();
};

/**
 * Configura os mocks do sistema de arquivos para evitar operações reais
 */
export const setupFsMock = () => {
  jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    writeFileSync: jest.fn(),
    unlinkSync: jest.fn(),
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn()
  }));
}; 