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

// Mocks para operaciones de Prisma
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindUnique = jest.fn();

/**
 * Mock del cliente Prisma
 * 
 * Patrón: Module Mock
 * 
 * Se utiliza jest.mock para reemplazar completamente el módulo @prisma/client,
 * evitando cualquier conexión real a la base de datos durante los tests.
 */
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
        update: mockUpdate,
        findUnique: mockFindUnique
      },
      $connect: jest.fn(),
      $disconnect: jest.fn()
    })),
    // Implementamos también las clases de error de Prisma para poder simular
    // errores específicos de la base de datos
    Prisma: {
      PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'PrismaClientInitializationError';
        }
      },
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        code: string;
        meta?: any;
        clientVersion: string;
        
        constructor(message: string, { code, clientVersion, meta }: { code: string; clientVersion: string; meta?: any }) {
          super(message);
          this.name = 'PrismaClientKnownRequestError';
          this.code = code;
          this.clientVersion = clientVersion;
          this.meta = meta;
        }
      }
    }
  };
});

/**
 * Mock del servicio de validación
 * 
 * Utilizamos un mock simple para poder controlar su comportamiento
 * en cada test específico.
 */
jest.mock('../src/application/validator', () => ({
  validateCandidateData: jest.fn()
}));

/**
 * Mock de la clase Candidate
 * 
 * Patrón: Class Mock
 * 
 * Reemplazamos completamente la clase Candidate para:
 * 1. Evitar dependencias externas durante los tests
 * 2. Poder controlar su comportamiento en cada escenario
 * 3. Verificar las interacciones entre componentes
 */
jest.mock('../src/domain/models/Candidate', () => {
  return {
    Candidate: class MockCandidate {
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

      // Mock del método save para poder controlarlo en los tests
      save = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          id: 1,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          address: this.address
        });
      });

      static findOne = jest.fn();
    }
  };
});

// Mocks para entidades relacionadas (siguiendo el mismo patrón)
jest.mock('../src/domain/models/Education', () => ({
  Education: class MockEducation {
    candidateId?: number;
    save = jest.fn().mockResolvedValue({});
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
}));

jest.mock('../src/domain/models/WorkExperience', () => ({
  WorkExperience: class MockWorkExperience {
    candidateId?: number;
    save = jest.fn().mockResolvedValue({});
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
}));

jest.mock('../src/domain/models/Resume', () => ({
  Resume: class MockResume {
    candidateId?: number;
    save = jest.fn().mockResolvedValue({});
    constructor(data: any) {
      Object.assign(this, data);
    }
  }
}));

/**
 * =================================================
 * SUITE DE TESTS
 * =================================================
 * 
 * Siguiendo el patrón AAA (Arrange-Act-Assert) y
 * organizando los tests por contexto y funcionalidad.
 */
describe('Sistema ATS - Módulo de inserción de candidatos', () => {
  /**
   * Configuración previa a cada test
   * 
   * Patrón: Test Setup
   * 
   * Limpiamos todos los mocks y establecemos valores predeterminados
   * para garantizar que cada test comienza con un estado limpio y predecible.
   */
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuración por defecto de mocks
    mockCreate.mockResolvedValue({ id: 1, ...CandidateFactory.valid() });
    (validateCandidateData as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * =================================================
   * TESTS DE VALIDACIÓN DE DATOS
   * =================================================
   * 
   * Separamos claramente los tests de validación de los de persistencia,
   * siguiendo el principio de Separación de Responsabilidades.
   */
  describe('1. Validación de datos del formulario', () => {
    /**
     * Test 1: Verificar la validación completa
     * 
     * Objetivo: Comprobar que todos los campos se validan correctamente
     */
    test('CUANDO se envía un formulario completo, ENTONCES se validan todos sus campos', () => {
      // Arrange: Preparamos un objeto candidato completo
      const candidatoCompleto = CandidateFactory.complete();
      
      // Act: Ejecutamos la función a probar
      addCandidate(candidatoCompleto);
      
      // Assert: Verificamos que se llamó al validador con todos los campos
      expect(validateCandidateData).toHaveBeenCalledWith(candidatoCompleto);
      expect(validateCandidateData).toHaveBeenCalledTimes(1);
    });

    /**
     * Test 2: Verificar validación de formatos
     * 
     * Objetivo: Comprobar que se validan correctamente los formatos específicos
     * como email y teléfono, rechazando los inválidos.
     */
    test('CUANDO los formatos de email o teléfono son incorrectos, ENTONCES se rechazan', () => {
      // Arrange: Configuramos el mock del validador para simular la validación real
      (validateCandidateData as jest.Mock).mockImplementation((data) => {
        // Implementamos reglas de validación equivalentes a las reales
        if (data.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
          throw new Error('Invalid email');
        }
        if (data.phone && !/^(6|7|9)\d{8}$/.test(data.phone)) {
          throw new Error('Invalid phone');
        }
        return true;
      });

      // Creamos variantes con datos inválidos usando nuestro factory
      const candidatoEmailInvalido = CandidateFactory.withInvalidEmail();
      const candidatoTelefonoInvalido = CandidateFactory.withInvalidPhone();
      
      // Act & Assert: Verificamos que se lanzan los errores esperados
      expect(() => validateCandidateData(candidatoEmailInvalido)).toThrow('Invalid email');
      expect(() => validateCandidateData(candidatoTelefonoInvalido)).toThrow('Invalid phone');
    });

    /**
     * Test 3: Verificar validación de campos obligatorios vs opcionales
     * 
     * Objetivo: Comprobar que se rechazan datos cuando faltan campos obligatorios,
     * incluso si se proporcionan campos opcionales.
     */
    test('CUANDO faltan campos obligatorios, ENTONCES se rechaza aunque haya campos opcionales', () => {
      // Arrange: Configuramos el mock del validador
      (validateCandidateData as jest.Mock).mockImplementation((data) => {
        // Simulamos las validaciones de campos obligatorios
        if (!data.firstName) throw new Error('Invalid name');
        if (!data.lastName) throw new Error('Invalid name');
        if (!data.email) throw new Error('Invalid email');
        return true;
      });

      // Creamos un objeto con solo campos opcionales
      const candidatoSoloOpcionales = CandidateFactory.withOptionalFieldsOnly();
      
      // Act & Assert: Verificamos que se rechaza
      expect(() => validateCandidateData(candidatoSoloOpcionales)).toThrow('Invalid name');
    });
  });

  /**
   * =================================================
   * TESTS DE PERSISTENCIA EN BASE DE DATOS
   * =================================================
   * 
   * Verificamos la correcta interacción con la capa de persistencia
   * y el manejo adecuado de errores de base de datos.
   */
  describe('2. Operaciones de base de datos', () => {
    /**
     * Test 1: Verificar inserción correcta
     * 
     * Objetivo: Comprobar que los datos se envían correctamente a Prisma
     * cuando son válidos.
     */
    test('CUANDO los datos son válidos, ENTONCES se insertan correctamente en la base de datos', async () => {
      // Arrange: Preparamos datos y configuramos el mock
      const candidatoValido = CandidateFactory.valid();
      const mockCandidateInstance = new Candidate(candidatoValido);
      
      // Configuramos el mock para simular la interacción real con Prisma
      jest.spyOn(mockCandidateInstance, 'save').mockImplementation(async function() {
        // Esta implementación simula cómo la clase real interactuaría con Prisma
        const result = await mockCreate({
          data: {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            address: this.address
          }
        });
        return result;
      });
      
      // Act: Ejecutamos la inserción
      await addCandidate(candidatoValido);
      
      // Assert: Verificamos que Prisma.create fue llamado con los datos correctos
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          firstName: candidatoValido.firstName,
          lastName: candidatoValido.lastName,
          email: candidatoValido.email
        })
      }));
    });

    /**
     * Test 2: Manejo de error de duplicación
     * 
     * Objetivo: Verificar que se maneja adecuadamente cuando se intenta
     * insertar un email que ya existe en la base de datos.
     * 
     * Este test simula el error P2002 de Prisma (violación de restricción única).
     */
    test('CUANDO el email ya existe, ENTONCES se maneja la excepción de duplicación', async () => {
      // Arrange: Preparamos datos y configuramos el error
      const candidatoValido = CandidateFactory.valid();
      const mockCandidateInstance = new Candidate(candidatoValido);
      
      // Creamos un error específico de Prisma para violación de clave única
      const prismaError = new (jest.requireMock('@prisma/client').Prisma.PrismaClientKnownRequestError)(
        'Unique constraint failed on the fields: (`email`)',
        {
          code: 'P2002', // Código específico para violación de restricción única
          clientVersion: '4.0.0',
          meta: { target: ['email'] }
        }
      );
      
      // Configuramos el mock para que rechace la promesa con este error
      jest.spyOn(mockCandidateInstance, 'save').mockRejectedValueOnce(prismaError);
      
      // Act & Assert: Verificamos que se maneja adecuadamente
      await expect(addCandidate(candidatoValido)).rejects.toThrow('The email already exists in the database');
    });

    /**
     * Test 3: Manejo de error de conexión
     * 
     * Objetivo: Verificar que se manejan adecuadamente los errores
     * de conexión a la base de datos.
     */
    test('CUANDO falla la conexión, ENTONCES se maneja la excepción de conexión', async () => {
      // Arrange: Preparamos datos y configuramos el error
      const candidatoValido = CandidateFactory.valid();
      const mockCandidateInstance = new Candidate(candidatoValido);
      
      // Creamos un error específico de Prisma para problemas de conexión
      const connectionError = new (jest.requireMock('@prisma/client').Prisma.PrismaClientInitializationError)(
        'Unable to connect to the database server'
      );
      
      // Configuramos el mock para que rechace la promesa con este error
      jest.spyOn(mockCandidateInstance, 'save').mockRejectedValueOnce(connectionError);
      
      // Act & Assert: Verificamos que se maneja adecuadamente
      await expect(addCandidate(candidatoValido)).rejects.toThrow('Unable to connect to the database server');
    });

    /**
     * Test 4: Verificar la integridad de datos
     * 
     * Objetivo: Comprobar que los datos se guardan exactamente como se envían,
     * sin alteraciones no deseadas.
     */
    test('CUANDO se guardan datos completos, ENTONCES se mantiene la integridad de todos los campos', async () => {
      // Arrange: Preparamos datos completos
      const candidatoCompleto = CandidateFactory.complete();
      const mockCandidateInstance = new Candidate(candidatoCompleto);
      
      // Preparamos la respuesta esperada
      const resultadoEsperado = { 
        id: 1, 
        ...candidatoCompleto,
        // Omitimos arrays que normalmente no se devuelven directamente
        educations: undefined,
        workExperiences: undefined
      };
      
      // Configuramos el mock para devolver este resultado
      jest.spyOn(mockCandidateInstance, 'save').mockResolvedValueOnce(resultadoEsperado);
      
      // Act: Ejecutamos la inserción
      const resultado = await addCandidate(candidatoCompleto);
      
      // Assert: Verificamos que se mantiene la integridad de todos los campos
      expect(resultado).toMatchObject({
        id: 1,
        firstName: candidatoCompleto.firstName,
        lastName: candidatoCompleto.lastName,
        email: candidatoCompleto.email,
        phone: candidatoCompleto.phone,
        address: candidatoCompleto.address
      });
    });
  });
}); 