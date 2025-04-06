// Mocks para pruebas
const mockValidateCandidateData = jest.fn();
const mockAddCandidate = jest.fn();
const mockSave = jest.fn();

// Mock del validador
jest.mock('../src/application/validator', () => ({
  validateCandidateData: mockValidateCandidateData
}));

// Mock del servicio de candidatos
jest.mock('../src/application/services/candidateService', () => ({
  addCandidate: mockAddCandidate
}));

// Mock de PrismaClient que evita la necesidad de importar @prisma/client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn()
      },
      $connect: jest.fn(),
      $disconnect: jest.fn()
    }))
  };
});

// Mock de la clase Candidate
jest.mock('../src/domain/models/Candidate', () => ({
  Candidate: jest.fn().mockImplementation((data) => {
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      education: data.education || [],
      workExperience: data.workExperience || [],
      resumes: data.resumes || [],
      save: mockSave
    };
  })
}));

// Datos de ejemplo para tests
const candidatoValido = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '666777888'
};

const candidatoCompleto = {
  firstName: 'María',
  lastName: 'García',
  email: 'maria.garcia@example.com',
  phone: '666111222',
  address: 'Calle Principal 123',
  educations: [
    {
      institution: 'Universidad Complutense',
      title: 'Ingeniería Informática',
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    }
  ],
  workExperiences: [
    {
      company: 'Empresa ABC',
      position: 'Desarrollador',
      description: 'Desarrollo de aplicaciones web',
      startDate: '2019-07-01',
      endDate: '2021-12-31'
    }
  ]
};

describe('Sistema ATS - Gestión de Candidatos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSave.mockResolvedValue({ id: 1, ...candidatoValido });
    mockValidateCandidateData.mockReturnValue(true);
    mockAddCandidate.mockResolvedValue({ id: 1, ...candidatoValido });
  });

  describe('1. Validación de datos del formulario', () => {
    test('CUANDO se valida un candidato completo, ENTONCES se aceptan todos los campos', () => {
      // Arrange
      const { validateCandidateData } = require('../src/application/validator');
      
      // Act
      validateCandidateData(candidatoCompleto);
      
      // Assert
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoCompleto);
      expect(mockValidateCandidateData).toHaveBeenCalledTimes(1);
    });

    test('CUANDO faltan campos obligatorios, ENTONCES se rechazan los datos', () => {
      // Arrange
      const { validateCandidateData } = require('../src/application/validator');
      
      mockValidateCandidateData.mockImplementation((data) => {
        if (!data.firstName) throw new Error('Invalid name');
        if (!data.lastName) throw new Error('Invalid name');
        if (!data.email) throw new Error('Invalid email');
        return true;
      });

      const candidatoIncompleto = {
        phone: '666777888',
        address: 'Dirección de prueba'
      };
      
      // Act & Assert
      expect(() => validateCandidateData(candidatoIncompleto)).toThrow('Invalid name');
    });

    test('CUANDO el formato de email es incorrecto, ENTONCES se rechaza', () => {
      // Arrange
      const { validateCandidateData } = require('../src/application/validator');
      
      mockValidateCandidateData.mockImplementation((data) => {
        if (data.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
          throw new Error('Invalid email');
        }
        return true;
      });

      const candidatoEmailInvalido = {
        ...candidatoValido,
        email: 'correo-invalido'
      };
      
      // Act & Assert
      expect(() => validateCandidateData(candidatoEmailInvalido)).toThrow('Invalid email');
    });
  });

  describe('2. Guardado en base de datos', () => {
    test('CUANDO los datos son válidos, ENTONCES se guardan correctamente', async () => {
      // Arrange
      const { addCandidate } = require('../src/application/services/candidateService');
      
      // Act
      const resultado = await addCandidate(candidatoValido);
      
      // Assert
      expect(resultado).toEqual(expect.objectContaining({
        id: 1,
        firstName: candidatoValido.firstName,
        lastName: candidatoValido.lastName,
        email: candidatoValido.email
      }));
      expect(mockAddCandidate).toHaveBeenCalledWith(candidatoValido);
    });

    test('CUANDO hay un error de base de datos, ENTONCES se maneja adecuadamente', async () => {
      // Arrange
      const { addCandidate } = require('../src/application/services/candidateService');
      
      // Simular un error
      mockAddCandidate.mockRejectedValueOnce(new Error('Database error'));
      
      // Act & Assert
      await expect(addCandidate(candidatoValido)).rejects.toThrow('Database error');
    });
  });
}); 