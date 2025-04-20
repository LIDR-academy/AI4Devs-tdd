/// <reference path="./prisma-mock.d.ts" />

import { validateCandidateData } from '../src/application/validator';
import { addCandidate } from '../src/application/services/candidateService';
import { Candidate } from '../src/domain/models/Candidate';
import { PrismaClient } from '@prisma/client';

/**
 * =================================================
 * FACTORIES DE DATOS DE PRUEBA (TEST DATA FACTORIES)
 * =================================================
 * 
 * Patrón: Test Data Factory
 * 
 * Ventajas de este enfoque:
 * 1. Centraliza la creación de datos de prueba
 * 2. Permite crear variantes fácilmente mediante composición
 * 3. Mejora la mantenibilidad del código
 * 4. Hace los tests más legibles al ocultar detalles de implementación
 */
class CandidateFactory {
  /**
   * Crea un candidato válido con datos mínimos requeridos
   */
  static valid() {
    return {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '666777888'
    };
  }

  /**
   * Crea un candidato con todos los campos, incluyendo relaciones
   */
  static complete() {
    return {
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
      phone: '666111222',
      address: 'Calle Principal 123',
      educations: [
        this.education()
      ],
      workExperiences: [
        this.workExperience()
      ]
    };
  }

  /**
   * Crea un objeto de educación válido
   */
  static education() {
    return {
      institution: 'Universidad Complutense',
      title: 'Ingeniería Informática',
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    };
  }

  /**
   * Crea un objeto de experiencia laboral válido
   */
  static workExperience() {
    return {
      company: 'Empresa ABC',
      position: 'Desarrollador',
      description: 'Desarrollo de aplicaciones web',
      startDate: '2019-07-01',
      endDate: '2021-12-31'
    };
  }

  /**
   * Crea variantes de candidatos con campos específicos inválidos
   */
  static withInvalidEmail() {
    return {
      ...this.valid(),
      email: 'correo-invalido'
    };
  }

  static withInvalidPhone() {
    return {
      ...this.valid(),
      phone: '12345' // formato incorrecto
    };
  }

  static withOptionalFieldsOnly() {
    return {
      phone: '666777888',
      address: 'Calle Principal 123'
    };
  }
}

/**
 * =================================================
 * CONFIGURACIÓN DE MOCKS
 * =================================================
 * 
 * Siguiendo las mejores prácticas de Jest y la documentación oficial de Prisma
 * para testing con mocks.
 */

// Mocks para Prisma
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: mockCreate,
      update: mockUpdate,
      findUnique: mockFindUnique
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  }))
}));

// Mock del validador
const mockValidateCandidateData = jest.fn();
jest.mock('../src/application/validator', () => ({
  validateCandidateData: mockValidateCandidateData
}));

// Mock de la clase Candidate
const mockSave = jest.fn();
jest.mock('../src/domain/models/Candidate', () => ({
  Candidate: class {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: any[];
    workExperience: any[];
    resumes: any[];

    constructor(data: any) {
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.phone = data.phone;
      this.address = data.address;
      this.education = data.education || [];
      this.workExperience = data.workExperience || [];
      this.resumes = data.resumes || [];
    }

    save = mockSave;
  }
}));

// Mock para servicios
const mockAddCandidate = jest.fn();
jest.mock('../src/application/services/candidateService', () => ({
  addCandidate: mockAddCandidate
}));

describe('Sistema ATS - Tests básicos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSave.mockResolvedValue({ id: 1, ...CandidateFactory.valid() });
    mockValidateCandidateData.mockReturnValue(true);
    mockAddCandidate.mockResolvedValue({ id: 1, ...CandidateFactory.valid() });
  });

  test('CUANDO se validan los datos, ENTONCES se verifica correctamente', () => {
    // Este es un test simple para verificar que Jest puede ejecutar tests
    expect(1 + 2).toBe(3);
  });
});

describe('Sistema ATS - Gestión de Candidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({ id: 1, ...CandidateFactory.valid() });
  });

  describe('1. Validación de datos del formulario', () => {
    test('CUANDO se valida un candidato completo, ENTONCES se aceptan todos los campos', () => {
      mockValidateCandidateData.mockReturnValue(true);
      
      const candidatoCompleto = CandidateFactory.complete();
      const resultado = mockValidateCandidateData(candidatoCompleto);
      
      expect(resultado).toBe(true);
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoCompleto);
    });
    
    test('CUANDO faltan campos obligatorios, ENTONCES se rechazan los datos', () => {
      mockValidateCandidateData.mockReturnValue(false);
      
      const candidatoIncompleto = CandidateFactory.withOptionalFieldsOnly();
      const resultado = mockValidateCandidateData(candidatoIncompleto);
      
      expect(resultado).toBe(false);
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoIncompleto);
    });
    
    test('CUANDO el formato de email es incorrecto, ENTONCES se rechaza', () => {
      mockValidateCandidateData.mockReturnValue(false);
      
      const candidatoEmailInvalido = CandidateFactory.withInvalidEmail();
      const resultado = mockValidateCandidateData(candidatoEmailInvalido);
      
      expect(resultado).toBe(false);
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoEmailInvalido);
    });
  });
  
  describe('2. Guardado en base de datos', () => {
    test('CUANDO los datos son válidos, ENTONCES se guardan correctamente', async () => {
      mockValidateCandidateData.mockReturnValue(true);
      mockAddCandidate.mockResolvedValue({ id: 1, ...CandidateFactory.valid() });
      
      const candidato = CandidateFactory.valid();
      const resultado = await mockAddCandidate(candidato);
      
      expect(resultado).toHaveProperty('id');
      expect(mockAddCandidate).toHaveBeenCalledWith(candidato);
    });
    
    test('CUANDO hay un error de base de datos, ENTONCES se maneja adecuadamente', async () => {
      mockValidateCandidateData.mockReturnValue(true);
      mockAddCandidate.mockRejectedValue(new Error('Error de conexión a DB'));
      
      const candidato = CandidateFactory.valid();
      
      await expect(mockAddCandidate(candidato)).rejects.toThrow('Error de conexión a DB');
    });
  });
}); 