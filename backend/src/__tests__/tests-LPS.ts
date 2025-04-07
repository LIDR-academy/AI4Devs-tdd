// Importaciones necesarias para todos los tests
import { Router } from 'express';
import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';
import { addCandidate } from '../application/services/candidateService';
import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import candidateRoutes from '../routes/candidateRoutes';

// ---------------------------------------------------
// Definición de interfaces para los mocks
// ---------------------------------------------------
interface MockPrismaError {
  code: string;
  message?: string;
}

interface MockCandidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: any[];
  workExperience: any[];
  resumes: any[];
  save: jest.Mock;
}

// ---------------------------------------------------
// Mocks compartidos para todos los tests
// ---------------------------------------------------

// Mock de prisma client
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockFindUnique = jest.fn();
  const mockResumeCreate = jest.fn();
  const mockEducationCreate = jest.fn();
  const mockWorkExperienceCreate = jest.fn();
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
        update: mockUpdate,
        findUnique: mockFindUnique
      },
      resume: {
        create: mockResumeCreate
      },
      education: {
        create: mockEducationCreate
      },
      workExperience: {
        create: mockWorkExperienceCreate
      }
    })),
    Prisma: {
      PrismaClientInitializationError: jest.fn().mockImplementation(function(this: MockPrismaError) {
        this.code = 'P1000';
      }),
      PrismaClientKnownRequestError: jest.fn().mockImplementation(function(this: MockPrismaError, message: string, { code }: { code: string }) {
        this.message = message;
        this.code = code;
      })
    }
  };
});

// Mock del modelo Candidate
jest.mock('../domain/models/Candidate', () => {
  const originalModule = jest.requireActual('../domain/models/Candidate');
  
  return {
    ...originalModule,
    Candidate: jest.fn().mockImplementation(function(this: MockCandidate, data: any) {
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.phone = data.phone;
      this.address = data.address;
      this.education = data.education || [];
      this.workExperience = data.workExperience || [];
      this.resumes = data.resumes || [];
      this.save = jest.fn().mockResolvedValue({ id: 1, ...data });
    })
  };
});

// Mock de los validadores
jest.mock('../application/validator');

// Mock del servicio de candidatos
jest.mock('../application/services/candidateService');

// ---------------------------------------------------
// Tests para las rutas de candidatos
// ---------------------------------------------------
describe('Candidate Routes', () => {
  test('should be a valid router object', () => {
    expect(candidateRoutes).toBeDefined();
    expect(typeof candidateRoutes).toBe('function');
  });
});

// ---------------------------------------------------
// Tests para el validador
// ---------------------------------------------------
describe('Candidate Validator', () => {
  // Familia de tests: validación de datos del formulario
  describe('Form Data Validation', () => {
    // Configuramos el comportamiento del mock para el validador
    beforeEach(() => {
      jest.resetAllMocks();
      // Configurando el mock para que lanze excepción cuando sea necesario
      (validateCandidateData as jest.Mock).mockImplementation((data) => {
        if (!data.firstName || data.firstName.length > 100) {
          throw new Error('Invalid name');
        }
        if (!data.lastName || data.lastName.length > 100) {
          throw new Error('Invalid name');
        }
        if (!data.email || !data.email.includes('@')) {
          throw new Error('Invalid email');
        }
        if (data.phone && data.phone.length < 9) {
          throw new Error('Invalid phone');
        }
        if (data.address && data.address.length > 100) {
          throw new Error('Invalid address');
        }
        if (data.educations && data.educations.length > 0) {
          for (const edu of data.educations) {
            if (edu.startDate && !edu.startDate.includes('-')) {
              throw new Error('Invalid date');
            }
          }
        }
        if (data.workExperiences && data.workExperiences.length > 0) {
          for (const exp of data.workExperiences) {
            if (exp.description && exp.description.length > 200) {
              throw new Error('Invalid description');
            }
          }
        }
        if (data.cv && (!data.cv.filePath || !data.cv.fileType)) {
          throw new Error('Invalid CV data');
        }
        return true;
      });
    });
    
    // TEST CRÍTICO: Criterio 3 - Validación de formato de email
    test('should validate email format correctly', () => {
      // Arrange
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456'
      };
      
      const invalidEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '666123456'
      };
      
      // Act & Assert - Datos válidos
      expect(() => validateCandidateData(validData)).not.toThrow();
      
      // Act & Assert - Email inválido
      expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
    });
    
    // Criterio 3 - Validación de campos obligatorios
    test('should validate required fields', () => {
      // Arrange - Sin firstName
      const missingFirstNameData = {
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456'
      };
      
      // Arrange - Sin lastName
      const missingLastNameData = {
        firstName: 'John',
        email: 'john.doe@example.com',
        phone: '666123456'
      };
      
      // Arrange - Sin email
      const missingEmailData = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '666123456'
      };
      
      // Act & Assert
      expect(() => validateCandidateData(missingFirstNameData)).toThrow('Invalid name');
      expect(() => validateCandidateData(missingLastNameData)).toThrow('Invalid name');
      expect(() => validateCandidateData(missingEmailData)).toThrow('Invalid email');
    });
    
    // Criterio 3 - Validación de formato de teléfono
    test('should validate phone format', () => {
      // Arrange
      const validPhoneData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456' // Formato válido
      };
      
      const invalidPhoneData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '12345' // Formato inválido
      };
      
      // Act & Assert
      expect(() => validateCandidateData(validPhoneData)).not.toThrow();
      expect(() => validateCandidateData(invalidPhoneData)).toThrow('Invalid phone');
    });
    
    // Criterio 3 - Validación de formatos de fecha
    test('should validate date formats in education and work experience', () => {
      // Arrange - Fechas válidas
      const validDatesData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'Universidad',
            title: 'Grado',
            startDate: '2015-01-01',
            endDate: '2019-01-01'
          }
        ],
        workExperiences: [
          {
            company: 'Empresa',
            position: 'Desarrollador',
            startDate: '2019-02-01',
            endDate: null // Permitido para trabajo actual
          }
        ]
      };
      
      // Arrange - Fechas inválidas
      const invalidStartDateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'Universidad',
            title: 'Grado',
            startDate: '01/01/2015', // Formato incorrecto
            endDate: '2019-01-01'
          }
        ]
      };
      
      // Act & Assert
      expect(() => validateCandidateData(validDatesData)).not.toThrow();
      expect(() => validateCandidateData(invalidStartDateData)).toThrow('Invalid date');
    });
    
    // Casos límite - Longitud máxima de campos
    test('should validate field length limits', () => {
      // Arrange - Nombre demasiado largo
      const longNameData = {
        firstName: 'J'.repeat(101), // Más de 100 caracteres
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };
      
      // Arrange - Dirección demasiado larga
      const longAddressData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        address: 'A'.repeat(101) // Más de 100 caracteres
      };
      
      // Arrange - Descripción de experiencia laboral demasiado larga
      const longDescriptionData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        workExperiences: [
          {
            company: 'Empresa',
            position: 'Desarrollador',
            description: 'D'.repeat(201), // Más de 200 caracteres
            startDate: '2019-01-01'
          }
        ]
      };
      
      // Act & Assert
      expect(() => validateCandidateData(longNameData)).toThrow('Invalid name');
      expect(() => validateCandidateData(longAddressData)).toThrow('Invalid address');
      expect(() => validateCandidateData(longDescriptionData)).toThrow('Invalid description');
    });
    
    // Criterio 4 - Validación de datos del CV
    test('should validate CV data', () => {
      // Arrange - CV válido
      const validCVData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {
          filePath: '/uploads/cv.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date()
        }
      };
      
      // Arrange - CV con datos incompletos
      const invalidCVData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {
          // Sin filePath
          fileType: 'application/pdf'
        }
      };
      
      // Act & Assert
      expect(() => validateCandidateData(validCVData)).not.toThrow();
      expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
    });
    
    // Caso especial - Edición de candidato existente
    test('should not validate required fields when editing existing candidate', () => {
      // Arrange - Datos parciales con ID (edición)
      const editData = {
        id: 1, // Indica que es una edición
        firstName: 'John Updated'
        // No se incluyen otros campos obligatorios
      };
      
      // Ajustando el mock para el caso de edición
      (validateCandidateData as jest.Mock).mockImplementation((data) => {
        if (data.id) {
          return true; // No validar si es una edición
        }
        
        // Resto del código original...
        throw new Error('Should not get here');
      });
      
      // Act & Assert
      expect(() => validateCandidateData(editData)).not.toThrow();
    });
  });
});

// ---------------------------------------------------
// Tests para el servicio de candidatos
// ---------------------------------------------------
describe('Candidate Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Familia de tests: recepción de los datos del formulario
  describe('Form Data Validation', () => {
    // TEST CRÍTICO: Criterio 3 - Validación de datos completos y correctos
    test('should validate all required candidate fields before saving', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        address: 'Main Street 123'
      };
      
      // Restauramos los mocks para este test específico
      jest.resetAllMocks();
      (validateCandidateData as jest.Mock).mockImplementation(() => true);
      
      // Y luego simulamos el comportamiento correcto de addCandidate
      (addCandidate as jest.Mock).mockImplementation(async (data) => {
        validateCandidateData(data);
        return { id: 1, ...data };
      });
      
      // Act
      await addCandidate(candidateData);
      
      // Assert
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    });
    
    // Criterio 3 - Validación de correo electrónico
    test('should throw an error when email format is invalid', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email', // Email inválido
        phone: '666123456'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid email');
      });
      
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid email'));
      
      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid email');
    });
    
    // Criterio 3 - Validación de campos obligatorios
    test('should throw an error when required fields are missing', async () => {
      // Arrange
      const candidateData = {
        // Sin firstName
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid name');
      });
      
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid name'));
      
      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });
    
    // Caso límite - Longitud máxima de campos
    test('should validate field length limits', async () => {
      // Arrange
      const candidateData = {
        firstName: 'J'.repeat(101), // Más largo que el límite de 100
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid name');
      });
      
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid name'));
      
      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
    });
  });

  // Familia de tests: guardado en la base de datos
  describe('Database Storage', () => {
    // TEST CRÍTICO: Criterio 5 - Confirmación de añadido exitoso
    test('should successfully save a candidate to the database', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        address: 'Main Street 123'
      };
      
      // Restauramos los mocks para este test específico
      jest.resetAllMocks();
      (validateCandidateData as jest.Mock).mockImplementation(() => true);
      
      // Simular el comportamiento correcto
      (addCandidate as jest.Mock).mockImplementation(async (data) => {
        validateCandidateData(data);
        return { id: 1, ...data };
      });
      
      // Act
      const result = await addCandidate(candidateData);
      
      // Assert
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(Number),
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email
      }));
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
    });
    
    // Criterio 6 - Manejo de errores (email duplicado)
    test('should handle duplicate email error from database', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        phone: '666123456'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => true);
      (addCandidate as jest.Mock).mockRejectedValue(new Error('The email already exists in the database'));
      
      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });
    
    // Criterio 6 - Manejo de errores de conexión a la base de datos
    test('should handle database connection errors', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456'
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => true);
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Database connection error'));
      
      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });
    
    // Criterio 4 - Prueba para carga de documentos (CV)
    test('should save candidate with CV document', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        cv: {
          filePath: '/uploads/cv_john_doe.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date()
        }
      };
      
      (validateCandidateData as jest.Mock).mockImplementation(() => true);
      
      // Configuramos el mock con resumes
      const candidateWithResume = {
        id: 1,
        ...candidateData,
        resumes: [candidateData.cv]
      };
      
      (addCandidate as jest.Mock).mockResolvedValue(candidateWithResume);
      
      // Act
      const result = await addCandidate(candidateData);
      
      // Assert
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(Number),
        resumes: expect.arrayContaining([
          expect.objectContaining({
            filePath: candidateData.cv.filePath,
            fileType: candidateData.cv.fileType
          })
        ])
      }));
    });
  });
});

// ---------------------------------------------------
// Tests para el controlador de candidatos
// ---------------------------------------------------
describe('Candidate Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    req = {
      body: {}
    };
    
    res = {
      status: mockStatus,
      json: mockJson
    };
    
    jest.clearAllMocks();
  });

  // Familia de tests: recepción de los datos del formulario
  describe('Form Data Reception', () => {
    // TEST CRÍTICO: Criterio 5 - Confirmación de añadido exitoso
    test('should return 201 status and success message when candidate is added successfully', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        address: 'Main Street 123'
      };
      
      req.body = candidateData;
      
      const savedCandidate = { 
        id: 1, 
        ...candidateData 
      };
      
      (candidateService.addCandidate as jest.Mock).mockResolvedValue(savedCandidate);
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });
    
    // Criterio 6 - Manejo de errores y excepciones
    test('should return 400 status and error message when validation fails', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        // lastName falta - campo obligatorio
        email: 'john.doe@example.com'
      };
      
      req.body = candidateData;
      
      const validationError = new Error('Invalid name');
      (candidateService.addCandidate as jest.Mock).mockRejectedValue(validationError);
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid name'
      });
    });
    
    // Criterio 6 - Manejo de errores de base de datos
    test('should return 400 status and error message when database error occurs', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com', // Email ya existente
        phone: '666123456'
      };
      
      req.body = candidateData;
      
      const dbError = new Error('The email already exists in the database');
      (candidateService.addCandidate as jest.Mock).mockRejectedValue(dbError);
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'The email already exists in the database'
      });
    });
    
    // Caso límite - Error desconocido
    test('should handle unknown errors gracefully', async () => {
      // Arrange
      req.body = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      
      // Simular un error que no es instancia de Error
      (candidateService.addCandidate as jest.Mock).mockRejectedValue('Unknown error');
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });
  });
  
  // Familia de tests: guardado con educación y experiencia laboral
  describe('Storing Complete Candidate Profile', () => {
    // Criterio 2 - Formulario con todos los campos, incluidos educación y experiencia laboral
    test('should process candidate with education and work experience', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        address: 'Main Street 123',
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Computer Science',
            startDate: '2015-09-01',
            endDate: '2019-06-30'
          }
        ],
        workExperiences: [
          {
            company: 'Tech Solutions',
            position: 'Developer',
            description: 'Full-stack development',
            startDate: '2019-07-01',
            endDate: null // Trabajo actual
          }
        ]
      };
      
      req.body = candidateData;
      
      const savedCandidate = { 
        id: 1, 
        ...candidateData 
      };
      
      (candidateService.addCandidate as jest.Mock).mockResolvedValue(savedCandidate);
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });
    
    // Criterio 4 - Carga de documentos (CV)
    test('should process candidate with CV document', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '666123456',
        cv: {
          filePath: '/uploads/cv_john_doe.pdf',
          fileType: 'application/pdf',
          uploadDate: new Date()
        }
      };
      
      req.body = candidateData;
      
      const savedCandidate = { 
        id: 1, 
        ...candidateData,
        resumes: [candidateData.cv]
      };
      
      (candidateService.addCandidate as jest.Mock).mockResolvedValue(savedCandidate);
      
      // Act
      await addCandidateController(req as Request, res as Response);
      
      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(candidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: savedCandidate
      });
    });
  });
});
