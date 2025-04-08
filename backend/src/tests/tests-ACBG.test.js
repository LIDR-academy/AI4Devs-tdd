const { Candidate } = require('../domain/models/Candidate');
const { validateCandidateData } = require('../application/validator');
const { addCandidate } = require('../application/services/candidateService');

// Mock de prisma para no depender de la base de datos real en las pruebas
jest.mock('@prisma/client', () => {
  // Definir el mock primero, antes de usarlo
  const mockPrismaClient = {
    candidate: {
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        firstName: 'Mock', 
        lastName: 'User', 
        email: 'mock@example.com' 
      }),
      update: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null) // Por defecto, no hay candidato existente
    },
    education: {
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        institution: 'Mock University', 
        title: 'Mock Degree' 
      })
    },
    workExperience: {
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        company: 'Mock Company', 
        position: 'Mock Position' 
      })
    },
    resume: {
      create: jest.fn().mockResolvedValue({ 
        id: 1, 
        filePath: 'mock/path', 
        fileType: 'application/pdf' 
      })
    },
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Mock del modelo Candidate
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1, ...data }),
        education: [],
        workExperience: [],
        resumes: []
      };
    })
  };
});

// Mock de Education, WorkExperience y Resume
jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation((data) => {
      return {
        ...data,
        save: jest.fn().mockResolvedValue({ id: 1, ...data })
      };
    })
  };
});

// Obtener una referencia al objeto mock para usarlo en las pruebas
const mockPrismaClient = require('@prisma/client').PrismaClient();

describe('Pruebas para la inserción de candidatos', () => {
  
  // Limpiar los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient.candidate.create.mockResolvedValue({ 
      id: 1, 
      firstName: 'Mock', 
      lastName: 'User', 
      email: 'mock@example.com' 
    });
    mockPrismaClient.candidate.findUnique.mockResolvedValue(null);
  });
  
  // Familia 1: Tests para la validación de datos del formulario
  describe('Validación de datos del candidato', () => {
    
    test('debería validar correctamente los datos de un candidato válido', () => {
      // Preparación - Arrange
      const candidatoValido = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        address: 'Calle Ejemplo 123'
      };
      
      // Acción - Act & Assert
      // Si no lanza error, la validación es correcta
      expect(() => validateCandidateData(candidatoValido)).not.toThrow();
    });
    
    test('debería rechazar un candidato con nombre inválido', () => {
      // Preparación
      const candidatoNombreInvalido = {
        firstName: '123', // Nombre inválido (solo números)
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678'
      };
      
      // Acción y verificación
      expect(() => validateCandidateData(candidatoNombreInvalido)).toThrow('Invalid name');
    });
    
    test('debería rechazar un candidato con email inválido', () => {
      // Preparación
      const candidatoEmailInvalido = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'correo-invalido', // Email sin @ ni dominio
        phone: '612345678'
      };
      
      // Acción y verificación
      expect(() => validateCandidateData(candidatoEmailInvalido)).toThrow('Invalid email');
    });
    
    test('debería rechazar un candidato con teléfono inválido', () => {
      // Preparación
      const candidatoTelefonoInvalido = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '1234' // Teléfono demasiado corto
      };
      
      // Acción y verificación
      expect(() => validateCandidateData(candidatoTelefonoInvalido)).toThrow('Invalid phone');
    });
    
    test('debería validar un candidato con educación', () => {
      // Preparación
      const candidatoConEducacion = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        educations: [
          {
            institution: 'Universidad Ejemplo',
            title: 'Ingeniería Informática',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
          }
        ]
      };
      
      // Acción y verificación
      expect(() => validateCandidateData(candidatoConEducacion)).not.toThrow();
    });
    
    test('debería rechazar un candidato con educación inválida', () => {
      // Preparación
      const candidatoEducacionInvalida = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        educations: [
          {
            institution: 'Universidad Ejemplo',
            title: 'Ingeniería Informática',
            startDate: '2015-13-01', // Fecha inválida (mes 13)
            endDate: '2019-06-30'
          }
        ]
      };
      
      // Acción y verificación
      expect(() => validateCandidateData(candidatoEducacionInvalida)).toThrow('Invalid date');
    });
  });
  
  // Familia 2: Tests para el guardado en base de datos
  describe('Guardado de candidatos en la base de datos', () => {
    
    test('debería guardar correctamente un candidato válido', async () => {
      // Configurar el mock para este test
      mockPrismaClient.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        address: 'Calle Ejemplo 123'
      });
      
      // Preparación
      const candidatoValido = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        address: 'Calle Ejemplo 123'
      };
      
      // Acción
      const resultado = await addCandidate(candidatoValido);
      
      // Verificación
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.firstName).toBe('Juan');
      expect(resultado.lastName).toBe('Pérez');
      expect(resultado.email).toBe('juan.perez@ejemplo.com');
    });
    
    test('debería guardar un candidato con educación correctamente', async () => {
      // Configurar mocks para este test
      mockPrismaClient.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@ejemplo.com'
      });
      
      // Preparación
      const candidatoConEducacion = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@ejemplo.com',
        phone: '612345678',
        educations: [
          {
            institution: 'Universidad Ejemplo',
            title: 'Ingeniería Informática',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
          }
        ]
      };
      
      // Acción
      const resultado = await addCandidate(candidatoConEducacion);
      
      // Verificación
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.firstName).toBe('María');
      expect(mockPrismaClient.education.create).toHaveBeenCalled();
    });
    
    test('debería guardar un candidato con experiencia laboral correctamente', async () => {
      // Configurar mocks para este test
      mockPrismaClient.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@ejemplo.com'
      });
      
      // Preparación
      const candidatoConExperiencia = {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@ejemplo.com',
        phone: '612345678',
        workExperiences: [
          {
            company: 'Empresa Ejemplo',
            position: 'Desarrollador Frontend',
            description: 'Desarrollo de aplicaciones web con React',
            startDate: '2019-07-01',
            endDate: '2022-12-31'
          }
        ]
      };
      
      // Acción
      const resultado = await addCandidate(candidatoConExperiencia);
      
      // Verificación
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.firstName).toBe('Carlos');
      expect(mockPrismaClient.workExperience.create).toHaveBeenCalled();
    });
    
    test('debería guardar un candidato con CV correctamente', async () => {
      // Configurar mocks para este test
      mockPrismaClient.candidate.create.mockResolvedValue({
        id: 1,
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@ejemplo.com'
      });
      
      // Preparación
      const candidatoConCV = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@ejemplo.com',
        phone: '612345678',
        resumes: [
          {
            filePath: 'uploads/cv_ana.pdf',
            fileType: 'application/pdf',
            originalName: 'cv_ana.pdf'
          }
        ]
      };
      
      // Acción
      const resultado = await addCandidate(candidatoConCV);
      
      // Verificación
      expect(resultado).toBeDefined();
      expect(resultado.id).toBe(1);
      expect(resultado.firstName).toBe('Ana');
      expect(mockPrismaClient.resume.create).toHaveBeenCalled();
    });
    
    test('debería rechazar un candidato con email duplicado', async () => {
      // Configurar el mock para este test específico
      mockPrismaClient.candidate.findUnique.mockResolvedValueOnce({
        id: 2,
        email: 'duplicado@ejemplo.com'
      });
      
      const candidatoDuplicado = {
        firstName: 'Pedro',
        lastName: 'Gómez',
        email: 'duplicado@ejemplo.com',
        phone: '612345678'
      };
      
      // Acción y verificación
      await expect(addCandidate(candidatoDuplicado)).rejects.toThrow('Candidate with this email already exists');
    });
  });
}); 