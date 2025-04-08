import request from 'supertest';
import { app } from '../index';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { paths } from '../index';
import {
  mockCandidateResponse,
  testCandidateData
} from './utils/testHelpers';

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn();
  const mockDeleteMany = jest.fn();
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();
  const mockDisconnect = jest.fn().mockResolvedValue(undefined);
  
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

// Mock do fs para evitar criar arquivos reais
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true)
}));

// Mock para o Express para fechar conexões corretamente
jest.mock('../index', () => {
  const originalModule = jest.requireActual('../index');
  const mockListen = jest.fn();
  
  return {
    ...originalModule,
    app: {
      ...originalModule.app,
      listen: mockListen
    }
  };
});

const prisma = new PrismaClient();

describe('Candidate API Integration Tests', () => {
  const testFilePath = path.join(__dirname, 'test-cv.pdf');
  
  beforeAll(() => {
    // Simular a criação de um arquivo PDF de teste
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
  });

  afterAll(async () => {
    // Garantir que a conexão do Prisma seja fechada
    await prisma.$disconnect();
    
    // Limpar todos os mocks
    jest.clearAllMocks();
    jest.resetModules();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/candidates', () => {
    it('deve fazer upload do CV e criar o candidato com sucesso', async () => {
      // Mock da resposta do Prisma
      (prisma.candidate.create as jest.Mock).mockResolvedValueOnce({
        ...mockCandidateResponse,
        cvUrl: '/uploads/mock-filename.pdf'
      });

      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', testCandidateData.firstName)
        .field('lastName', testCandidateData.lastName)
        .field('email', testCandidateData.email)
        .field('phoneNumber', testCandidateData.phoneNumber)
        .field('education', testCandidateData.education)
        .field('workExperience', testCandidateData.workExperience)
        .attach('cv', testFilePath);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(testCandidateData.firstName);
      expect(response.body.lastName).toBe(testCandidateData.lastName);
      expect(response.body.email).toBe(testCandidateData.email);
      expect(response.body.cvUrl).toMatch(/^\/uploads\//);
      
      // Verificar se o Prisma foi chamado corretamente
      expect(prisma.candidate.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar candidato sem arquivo de CV', async () => {
      // Mock da resposta do Prisma sem CV
      const responseWithoutCV = {
        ...mockCandidateResponse,
        email: 'test2@example.com',
        cvUrl: null
      };
      
      (prisma.candidate.create as jest.Mock).mockResolvedValueOnce(responseWithoutCV);

      const response = await request(app)
        .post('/api/candidates')
        .field('firstName', testCandidateData.firstName)
        .field('lastName', testCandidateData.lastName)
        .field('email', 'test2@example.com');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.cvUrl).toBeNull();
      
      // Verificar se o Prisma foi chamado corretamente
      expect(prisma.candidate.create).toHaveBeenCalledTimes(1);
      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: testCandidateData.firstName,
          lastName: testCandidateData.lastName,
          email: 'test2@example.com',
          cvUrl: null
        })
      });
    });

    it('deve retornar erro para campos obrigatórios faltando', async () => {
      const response = await request(app)
        .post('/api/candidates')
        .field('lastName', testCandidateData.lastName)
        .field('phoneNumber', testCandidateData.phoneNumber);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Required fields are missing');
      
      // Verificar que o Prisma não foi chamado
      expect(prisma.candidate.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/candidates', () => {
    it('deve retornar todos os candidatos', async () => {
      // Mock para a busca de todos os candidatos
      const candidatesList = [mockCandidateResponse];
      (prisma.candidate.findMany as jest.Mock).mockResolvedValueOnce(candidatesList);

      const response = await request(app).get('/api/candidates');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('id', mockCandidateResponse.id);
      
      // Verificar se o Prisma foi chamado corretamente
      expect(prisma.candidate.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc'
        }
      });
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('deve retornar um candidato pelo ID', async () => {
      // Mock para a busca de um candidato por ID
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce(mockCandidateResponse);

      const response = await request(app).get('/api/candidates/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockCandidateResponse.id);
      expect(response.body).toHaveProperty('firstName', mockCandidateResponse.firstName);
      
      // Verificar se o Prisma foi chamado corretamente
      expect(prisma.candidate.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('deve retornar 404 quando o candidato não for encontrado', async () => {
      // Mock para quando o candidato não é encontrado
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).get('/api/candidates/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Candidate not found');
      
      // Verificar se o Prisma foi chamado corretamente
      expect(prisma.candidate.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
    });
  });
}); 