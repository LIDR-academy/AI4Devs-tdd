import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';

// Mock para validador
jest.mock('../application/validator', () => {
  return {
    validateCandidateData: jest.fn()
  };
});

const mockValidateCandidateData = validateCandidateData as jest.MockedFunction<typeof validateCandidateData>;

// Mock para los modelos
const mockCandidateSave = jest.fn();
const mockEducationSave = jest.fn();
const mockWorkExperienceSave = jest.fn();
const mockResumeSave = jest.fn();

// Mock de clases
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation(() => {
      return {
        save: mockCandidateSave,
        education: [],
        workExperience: [],
        resumes: []
      };
    })
  };
});

jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation(() => {
      return {
        save: mockEducationSave,
        candidateId: null
      };
    })
  };
});

jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation(() => {
      return {
        save: mockWorkExperienceSave,
        candidateId: null
      };
    })
  };
});

jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation(() => {
      return {
        save: mockResumeSave,
        candidateId: null
      };
    })
  };
});

// Tests
describe('Inserción de candidatos', () => {
  
  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  describe('Validación de datos del formulario', () => {
    it('debe validar correctamente un candidato con datos completos', async () => {
      // Arrange
      const candidatoValido = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '612345678',
        address: 'Calle Ejemplo 123, Madrid',
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
            company: 'Empresa Tech',
            position: 'Desarrollador Junior',
            description: 'Desarrollo de aplicaciones web',
            startDate: '2019-07-15',
            endDate: '2021-12-31'
          }
        ],
        cv: {
          filePath: 'uploads/1234567890-cv.pdf',
          fileType: 'application/pdf'
        }
      };

      // Mock que no lance error en validación
      mockValidateCandidateData.mockImplementation(() => true);
      
      // Mock para guardar candidato
      mockCandidateSave.mockResolvedValue({ id: 1, ...candidatoValido });

      // Act & Assert
      await expect(addCandidate(candidatoValido)).resolves.toBeTruthy();
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoValido);
    });

    it('debe rechazar un candidato con email inválido', async () => {
      // Arrange
      const candidatoInvalido = {
        firstName: 'María',
        lastName: 'García',
        email: 'email-invalido', // Email inválido
        phone: '698765432',
        address: 'Avenida Principal 45, Barcelona',
        educations: [],
        workExperiences: [],
        cv: null
      };

      // Mock que lance error en validación
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('El formato del email no es válido');
      });

      // Act & Assert
      await expect(addCandidate(candidatoInvalido))
        .rejects.toThrow('El formato del email no es válido');
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoInvalido);
    });

    it('debe rechazar un candidato sin nombre o apellido', async () => {
      // Arrange
      const candidatoSinNombre = {
        firstName: '', // Nombre vacío
        lastName: 'Rodríguez',
        email: 'test@ejemplo.com',
        phone: '633445566',
        address: 'Plaza Mayor 1, Valencia',
        educations: [],
        workExperiences: [],
        cv: null
      };

      // Mock que lance error en validación
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('El nombre no puede estar vacío');
      });

      // Act & Assert
      await expect(addCandidate(candidatoSinNombre))
        .rejects.toThrow('El nombre no puede estar vacío');
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoSinNombre);
    });

    it('debe validar fechas en educación y experiencia laboral', async () => {
      // Arrange
      const candidatoConFechasInvalidas = {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@ejemplo.com',
        phone: '677889900',
        address: 'Calle Real 7, Sevilla',
        educations: [
          {
            institution: 'Universidad de Sevilla',
            title: 'Administración de Empresas',
            startDate: '2020-01-01',
            endDate: '2018-12-31' // Fecha fin anterior a fecha inicio
          }
        ],
        workExperiences: [],
        cv: null
      };

      // Mock que lance error en validación
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      });

      // Act & Assert
      await expect(addCandidate(candidatoConFechasInvalidas))
        .rejects.toThrow('La fecha de fin no puede ser anterior a la fecha de inicio');
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoConFechasInvalidas);
    });
  });

  describe('Persistencia en base de datos', () => {
    it('debe guardar correctamente un candidato en la base de datos', async () => {
      // Arrange
      const candidatoValido = {
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@ejemplo.com',
        phone: '644556677',
        address: 'Avenida Principal 12, Madrid',
        educations: [
          {
            institution: 'Universidad Autónoma',
            title: 'Ingeniería Industrial',
            startDate: '2010-09-01',
            endDate: '2015-06-30'
          }
        ],
        workExperiences: [
          {
            company: 'Multinacional SA',
            position: 'Ingeniero de Proyecto',
            description: 'Gestión de proyectos industriales',
            startDate: '2015-09-01',
            endDate: '2020-08-31'
          }
        ],
        cv: {
          filePath: 'uploads/9876543210-cv.pdf',
          fileType: 'application/pdf'
        }
      };
      
      // Mocks
      const savedCandidate = { id: 1, ...candidatoValido };
      mockValidateCandidateData.mockImplementation(() => true);
      mockCandidateSave.mockResolvedValue(savedCandidate);
      mockEducationSave.mockResolvedValue({});
      mockWorkExperienceSave.mockResolvedValue({});
      mockResumeSave.mockResolvedValue({});

      // Act
      const resultado = await addCandidate(candidatoValido);

      // Assert
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoValido);
      expect(mockCandidateSave).toHaveBeenCalled();
      expect(resultado).toEqual(savedCandidate);
    });

    it('debe manejar errores de la base de datos al guardar un candidato', async () => {
      // Arrange
      const candidatoValido = {
        firstName: 'Elena',
        lastName: 'Sánchez',
        email: 'elena.sanchez@ejemplo.com',
        phone: '611223344',
        address: 'Calle Mayor 8, Zaragoza',
        educations: [],
        workExperiences: [],
        cv: null
      };
      
      // Mocks
      mockValidateCandidateData.mockImplementation(() => true);
      const errorDB = new Error('Error de conexión a la base de datos');
      mockCandidateSave.mockRejectedValue(errorDB);

      // Act & Assert
      await expect(addCandidate(candidatoValido))
        .rejects.toThrow('Error de conexión a la base de datos');
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoValido);
      expect(mockCandidateSave).toHaveBeenCalled();
    });

    it('debe verificar que se guardan correctamente las relaciones (educación y experiencia)', async () => {
      // Arrange
      const candidatoCompleto = {
        firstName: 'Pablo',
        lastName: 'Fernández',
        email: 'pablo.fernandez@ejemplo.com',
        phone: '655443322',
        address: 'Plaza Central 3, Barcelona',
        educations: [
          {
            institution: 'Universidad Politécnica',
            title: 'Ingeniería de Telecomunicaciones',
            startDate: '2012-09-01',
            endDate: '2017-06-30'
          },
          {
            institution: 'Business School',
            title: 'MBA',
            startDate: '2018-01-15',
            endDate: '2019-12-20'
          }
        ],
        workExperiences: [
          {
            company: 'Consultora IT',
            position: 'Consultor Tecnológico',
            description: 'Consultoría en proyectos de telecomunicaciones',
            startDate: '2017-09-01',
            endDate: '2020-03-31'
          }
        ],
        cv: {
          filePath: 'uploads/5566778899-cv.pdf',
          fileType: 'application/pdf'
        }
      };
      
      // Mocks
      const savedCandidate = { id: 5, ...candidatoCompleto };
      mockValidateCandidateData.mockImplementation(() => true);
      mockCandidateSave.mockResolvedValue(savedCandidate);
      mockEducationSave.mockResolvedValue({});
      mockWorkExperienceSave.mockResolvedValue({});
      mockResumeSave.mockResolvedValue({});

      // Act
      const resultado = await addCandidate(candidatoCompleto);

      // Assert
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidatoCompleto);
      expect(mockCandidateSave).toHaveBeenCalled();
      expect(mockEducationSave).toHaveBeenCalledTimes(candidatoCompleto.educations.length);
      expect(mockWorkExperienceSave).toHaveBeenCalledTimes(candidatoCompleto.workExperiences.length);
      expect(mockResumeSave).toHaveBeenCalledTimes(1); // Una vez para el CV
      expect(resultado).toEqual(savedCandidate);
      expect(resultado.id).toBe(5);
    });
  });
}); 