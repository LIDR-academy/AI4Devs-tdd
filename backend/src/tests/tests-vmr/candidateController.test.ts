import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createCandidate, getCandidate, getAllCandidates } from '../controllers/candidateController';
import {
  mockRequest,
  mockResponse,
  testCandidateData,
  mockCandidateResponse
} from './utils/testHelpers';

// Mock do PrismaClient
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn();
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();
  const mockDisconnect = jest.fn().mockResolvedValue(undefined);
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
        findMany: mockFindMany,
        findUnique: mockFindUnique
      },
      $disconnect: mockDisconnect
    }))
  };
});

describe('Candidate Controller', () => {
  let prisma: PrismaClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });
  
  afterAll(async () => {
    // Garantir desconexão
    await prisma.$disconnect();
    
    // Limpar mocks e módulos
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('createCandidate', () => {
    it('deve criar um candidato com todos os campos', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phoneNumber: '1234567890',
        education: 'Bacharel em Sistemas',
        workExperience: '2 anos como desenvolvedor'
      };
      
      // Mock simplificado de um arquivo de upload, sem a propriedade stream
      // que para o teste não é necessária
      req.file = {
        filename: 'test-cv.pdf',
        path: '/path/to/test-cv.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        destination: 'uploads/',
        fieldname: 'cv',
        originalname: 'original-cv.pdf',
        encoding: '7bit',
        buffer: Buffer.from(''),
        stream: {} as any
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...req.body,
        cvUrl: `/uploads/${req.file.filename}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (prisma.candidate.create as jest.Mock).mockResolvedValueOnce(mockCreatedCandidate);
      
      // Act
      await createCandidate(req, res);
      
      // Assert
      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          education: req.body.education,
          workExperience: req.body.workExperience,
          cvUrl: `/uploads/${req.file.filename}`
        }
      });
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedCandidate);
    });

    it('deve criar um candidato sem CV', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@example.com'
      };
      
      const mockCreatedCandidate = {
        id: 2,
        ...req.body,
        phoneNumber: null,
        address: null,
        education: null,
        workExperience: null,
        cvUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (prisma.candidate.create as jest.Mock).mockResolvedValueOnce(mockCreatedCandidate);
      
      // Act
      await createCandidate(req, res);
      
      // Assert
      expect(prisma.candidate.create).toHaveBeenCalledWith({
        data: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phoneNumber: undefined,
          address: undefined,
          education: undefined,
          workExperience: undefined,
          cvUrl: null
        }
      });
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedCandidate);
    });

    it('deve retornar erro quando campos obrigatórios estiverem faltando', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        lastName: 'Oliveira',
        phoneNumber: '11987654321'
      };
      
      // Act
      await createCandidate(req, res);
      
      // Assert
      expect(prisma.candidate.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Required fields are missing' });
    });

    it('deve lidar com erros do Prisma', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        firstName: 'Pedro',
        lastName: 'Costa',
        email: 'pedro@example.com'
      };
      
      const mockError = new Error('Erro de validação');
      (prisma.candidate.create as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Espiar console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      await createCandidate(req, res);
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error creating candidate:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
      
      consoleSpy.mockRestore();
    });
  });

  describe('getAllCandidates', () => {
    it('deve retornar todos os candidatos', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      const mockCandidates = [
        {
          id: 1,
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          cvUrl: '/uploads/cv1.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          firstName: 'Maria',
          lastName: 'Santos',
          email: 'maria@example.com',
          cvUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      (prisma.candidate.findMany as jest.Mock).mockResolvedValueOnce(mockCandidates);
      
      // Act
      await getAllCandidates(req, res);
      
      // Assert
      expect(prisma.candidate.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      expect(res.json).toHaveBeenCalledWith(mockCandidates);
    });

    it('deve lidar com erros do Prisma', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      const mockError = new Error('Erro de conexão');
      (prisma.candidate.findMany as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Espiar console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      await getAllCandidates(req, res);
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching candidates:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
      
      consoleSpy.mockRestore();
    });
  });

  describe('getCandidate', () => {
    it('deve retornar um candidato pelo ID', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { id: '1' };
      
      const mockCandidate = {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phoneNumber: '1234567890',
        address: 'Rua ABC, 123',
        education: 'Bacharel em Sistemas',
        workExperience: '2 anos como desenvolvedor',
        cvUrl: '/uploads/cv1.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce(mockCandidate);
      
      // Act
      await getCandidate(req, res);
      
      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      
      expect(res.json).toHaveBeenCalledWith(mockCandidate);
    });

    it('deve retornar 404 quando o candidato não for encontrado', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { id: '999' };
      
      (prisma.candidate.findUnique as jest.Mock).mockResolvedValueOnce(null);
      
      // Act
      await getCandidate(req, res);
      
      // Assert
      expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: 999 }
      });
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Candidate not found' });
    });

    it('deve lidar com erros do Prisma', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { id: '1' };
      
      const mockError = new Error('Erro de busca');
      (prisma.candidate.findUnique as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Espiar console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Act
      await getCandidate(req, res);
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching candidate:', mockError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
      
      consoleSpy.mockRestore();
    });
  });
}); 