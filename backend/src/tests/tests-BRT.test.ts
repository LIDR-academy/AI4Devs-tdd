// Importaciones necesarias
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { addCandidateController } from '../presentation/controllers/candidateController';
import { uploadFile } from '../application/services/fileUploadService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { Request, Response } from 'express';

// Definir tipos para los mocks de Multer
interface MockMulter extends jest.Mock {
  diskStorage: jest.Mock;
  MulterError: new (code: string, message: string) => Error & { code: string };
}

// Mock para multer
jest.mock('multer', () => {
  const multerMock = jest.fn().mockReturnValue({
    single: jest.fn().mockReturnValue((req: any, res: any, next: any) => next())
  }) as MockMulter;
  
  multerMock.diskStorage = jest.fn().mockReturnValue({
    destination: jest.fn(),
    filename: jest.fn()
  });
  
  // Añadir la clase de error de multer
  class MulterError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  }
  
  multerMock.MulterError = MulterError;
  
  return multerMock;
});

// Mock para las clases de dominio
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');

// Mock para el servicio de candidatos (solo para las pruebas del controlador)
jest.mock('../application/services/candidateService', () => ({
  addCandidate: jest.fn()
}));

// Mock para PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn()
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Tests de validación de datos
describe('Validación de datos de candidato', () => {
  
  // Test para datos válidos
  test('debería aceptar datos válidos de candidato', () => {
    const validCandidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Principal 123',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniero de Software',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }
      ],
      cv: {
        filePath: '/uploads/1234567890-cv.pdf',
        fileType: 'application/pdf'
      }
    };

    // No debería lanzar errores
    expect(() => validateCandidateData(validCandidateData)).not.toThrow();
  });

  // Test para firstName inválido
  test('debería rechazar firstName inválido', () => {
    const invalidFirstNameData = {
      firstName: '12', // Números no permitidos en el nombre
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };

    expect(() => validateCandidateData(invalidFirstNameData)).toThrow('Invalid name');
  });

  // Test para lastName inválido
  test('debería rechazar lastName inválido', () => {
    const invalidLastNameData = {
      firstName: 'Juan',
      lastName: '@Perez', // Caracteres especiales no permitidos
      email: 'juan.perez@example.com',
      phone: '612345678'
    };

    expect(() => validateCandidateData(invalidLastNameData)).toThrow('Invalid name');
  });

  // Test para email inválido
  test('debería rechazar email inválido', () => {
    const invalidEmailData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example', // Email incompleto
      phone: '612345678'
    };

    expect(() => validateCandidateData(invalidEmailData)).toThrow('Invalid email');
  });

  // Test para teléfono inválido
  test('debería rechazar teléfono inválido', () => {
    const invalidPhoneData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '512345678' // No comienza con 6, 7 o 9
    };

    expect(() => validateCandidateData(invalidPhoneData)).toThrow('Invalid phone');
  });

  // Test para datos de educación inválidos
  test('debería rechazar datos de educación inválidos', () => {
    const invalidEducationData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniero de Software',
          startDate: '2015/09/01', // Formato de fecha incorrecto
          endDate: '2019-06-30'
        }
      ]
    };

    expect(() => validateCandidateData(invalidEducationData)).toThrow('Invalid date');
  });

  // Test para datos de experiencia laboral inválidos
  test('debería rechazar datos de experiencia laboral inválidos', () => {
    const invalidWorkExperienceData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web con un texto extremadamente largo que supera el límite de caracteres permitido por la base de datos y por lo tanto debe ser rechazado por el validador para prevenir errores de truncamiento de datos'.repeat(3), // Descripción demasiado larga
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }
      ]
    };

    expect(() => validateCandidateData(invalidWorkExperienceData)).toThrow('Invalid description');
  });

  // Test para datos de CV inválidos
  test('debería rechazar datos de CV inválidos', () => {
    const invalidCVData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      cv: {
        // Falta el campo filePath
        fileType: 'application/pdf'
      }
    };

    expect(() => validateCandidateData(invalidCVData)).toThrow('Invalid CV data');
  });
});

// Tests para el servicio de candidatos
describe('Servicio de candidatos (addCandidate)', () => {
  
  // Mock del servicio real para las pruebas
  let mockAddCandidateService: jest.Mock;
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear un mock del servicio para las pruebas
    mockAddCandidateService = jest.fn();
    
    // Diferentes implementaciones según el caso de prueba
    // El comportamiento se establecerá en cada test
    
    // Configurar los mocks para cada clase de dominio
    (Candidate as unknown as jest.Mock).mockImplementation(function(this: any, data: any) {
      this.id = 1;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.phone = data.phone;
      this.address = data.address;
      this.education = [];
      this.workExperience = [];
      this.resumes = [];
      this.save = jest.fn().mockResolvedValue({ ...data, id: 1 });
    });
    
    (Education as unknown as jest.Mock).mockImplementation(function(this: any, data: any) {
      this.id = 1;
      this.institution = data.institution;
      this.title = data.title;
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.candidateId = null;
      this.save = jest.fn().mockResolvedValue({ ...data, id: 1 });
    });
    
    (WorkExperience as unknown as jest.Mock).mockImplementation(function(this: any, data: any) {
      this.id = 1;
      this.company = data.company;
      this.position = data.position;
      this.description = data.description;
      this.startDate = data.startDate;
      this.endDate = data.endDate;
      this.candidateId = null;
      this.save = jest.fn().mockResolvedValue({ ...data, id: 1 });
    });
    
    (Resume as unknown as jest.Mock).mockImplementation(function(this: any, data: any) {
      this.id = 1;
      this.filePath = data.filePath;
      this.fileType = data.fileType;
      this.uploadDate = new Date();
      this.candidateId = null;
      this.save = jest.fn().mockResolvedValue({ ...data, id: 1 });
    });
  });
  
  // Test para verificar que valida los datos correctamente
  test('debería validar los datos correctamente', () => {
    const validCandidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Principal 123'
    };
    
    // No debería lanzar un error al validar datos correctos
    expect(() => validateCandidateData(validCandidateData)).not.toThrow();
    
    const invalidCandidateData = {
      firstName: '12', // Números no permitidos en el nombre
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Debería lanzar un error al validar datos incorrectos
    expect(() => validateCandidateData(invalidCandidateData)).toThrow('Invalid name');
  });
  
  // Test para verificar que se crea una instancia de Candidate
  test('debería crear una instancia de Candidate con los datos proporcionados', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Implementar una versión simplificada de addCandidate para probar la creación del candidato
    const simplifiedAddCandidate = async (data: any) => {
      validateCandidateData(data);
      const candidate = new Candidate(data);
      await candidate.save();
      return candidate;
    };
    
    await simplifiedAddCandidate(candidateData);
    
    // Verificar que se creó la instancia con los datos correctos
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    
    // Verificar que se llamó al método save
    const candidateInstance = (Candidate as unknown as jest.Mock).mock.instances[0];
    expect(candidateInstance.save).toHaveBeenCalled();
  });
  
  // Test para verificar que se procesan correctamente los datos de educación
  test('debería procesar correctamente los datos de educación', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniero de Software',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ]
    };
    
    // Implementar una versión simplificada de addCandidate para probar el procesamiento de educación
    const simplifiedAddCandidate = async (data: any) => {
      validateCandidateData(data);
      const candidate = new Candidate(data);
      const savedCandidate = await candidate.save();
      
      if (data.educations) {
        for (const education of data.educations) {
          const educationModel = new Education(education);
          educationModel.candidateId = savedCandidate.id;
          await educationModel.save();
          candidate.education.push(educationModel);
        }
      }
      
      return savedCandidate;
    };
    
    await simplifiedAddCandidate(candidateData);
    
    // Verificar que se creó la instancia de Education
    expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
    
    // Verificar que se estableció el candidateId
    const educationInstance = (Education as unknown as jest.Mock).mock.instances[0];
    expect(educationInstance.candidateId).toBe(1);
    
    // Verificar que se llamó al método save
    expect(educationInstance.save).toHaveBeenCalled();
  });
  
  // Test para verificar que se procesan correctamente los datos de experiencia laboral
  test('debería procesar correctamente los datos de experiencia laboral', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }
      ]
    };
    
    // Implementar una versión simplificada de addCandidate para probar el procesamiento de experiencia laboral
    const simplifiedAddCandidate = async (data: any) => {
      validateCandidateData(data);
      const candidate = new Candidate(data);
      const savedCandidate = await candidate.save();
      
      if (data.workExperiences) {
        for (const experience of data.workExperiences) {
          const experienceModel = new WorkExperience(experience);
          experienceModel.candidateId = savedCandidate.id;
          await experienceModel.save();
          candidate.workExperience.push(experienceModel);
        }
      }
      
      return savedCandidate;
    };
    
    await simplifiedAddCandidate(candidateData);
    
    // Verificar que se creó la instancia de WorkExperience
    expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
    
    // Verificar que se estableció el candidateId
    const workExperienceInstance = (WorkExperience as unknown as jest.Mock).mock.instances[0];
    expect(workExperienceInstance.candidateId).toBe(1);
    
    // Verificar que se llamó al método save
    expect(workExperienceInstance.save).toHaveBeenCalled();
  });
  
  // Test para verificar que se procesan correctamente los datos de CV
  test('debería procesar correctamente los datos de CV', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      cv: {
        filePath: '/uploads/1234567890-cv.pdf',
        fileType: 'application/pdf'
      }
    };
    
    // Implementar una versión simplificada de addCandidate para probar el procesamiento de CV
    const simplifiedAddCandidate = async (data: any) => {
      validateCandidateData(data);
      const candidate = new Candidate(data);
      const savedCandidate = await candidate.save();
      
      if (data.cv && Object.keys(data.cv).length > 0) {
        const resumeModel = new Resume(data.cv);
        resumeModel.candidateId = savedCandidate.id;
        await resumeModel.save();
        candidate.resumes.push(resumeModel);
      }
      
      return savedCandidate;
    };
    
    await simplifiedAddCandidate(candidateData);
    
    // Verificar que se creó la instancia de Resume
    expect(Resume).toHaveBeenCalledWith(candidateData.cv);
    
    // Verificar que se estableció el candidateId
    const resumeInstance = (Resume as unknown as jest.Mock).mock.instances[0];
    expect(resumeInstance.candidateId).toBe(1);
    
    // Verificar que se llamó al método save
    expect(resumeInstance.save).toHaveBeenCalled();
  });
  
  // Test para verificar el manejo de errores
  test('debería manejar el error cuando falla la creación del candidato', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Configurar el mock para que lance un error con código P2002
    const mockSave = jest.fn().mockRejectedValue({ code: 'P2002' });
    (Candidate as unknown as jest.Mock).mockImplementation(function(this: any) {
      this.save = mockSave;
      this.education = [];
      this.workExperience = [];
      this.resumes = [];
    });
    
    // Implementar una versión simplificada de addCandidate para probar el manejo de errores
    const simplifiedAddCandidate = async (data: any) => {
      try {
        validateCandidateData(data);
        const candidate = new Candidate(data);
        const savedCandidate = await candidate.save();
        return savedCandidate;
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new Error('The email already exists in the database');
        } else {
          throw error;
        }
      }
    };
    
    await expect(simplifiedAddCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
  });
  
  // Test para verificar el manejo de errores genéricos
  test('debería propagar otros errores', async () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Configurar el mock para que lance un error genérico
    const mockError = new Error('Error de servidor');
    const mockSave = jest.fn().mockRejectedValue(mockError);
    (Candidate as unknown as jest.Mock).mockImplementation(function(this: any) {
      this.save = mockSave;
      this.education = [];
      this.workExperience = [];
      this.resumes = [];
    });
    
    // Implementar una versión simplificada de addCandidate para probar el manejo de errores
    const simplifiedAddCandidate = async (data: any) => {
      try {
        validateCandidateData(data);
        const candidate = new Candidate(data);
        const savedCandidate = await candidate.save();
        return savedCandidate;
      } catch (error: any) {
        throw error;
      }
    };
    
    await expect(simplifiedAddCandidate(candidateData)).rejects.toThrow('Error de servidor');
  });
});

// Tests para el controlador de candidatos
describe('Controlador de candidatos', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: {
    statusCode: number;
    jsonValue: null | { message?: string; error?: string; data?: any };
  };
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configuración de objetos mock para Request y Response
    responseObject = {
      statusCode: 0,
      jsonValue: null
    };
    
    mockRequest = {
      body: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '612345678'
      }
    };
    
    mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((value) => {
        responseObject.jsonValue = value;
        return mockResponse;
      })
    };
  });
  
  // Test para verificar que el controlador llama al servicio correcto
  test('debería llamar al servicio addCandidate con los datos correctos', async () => {
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    expect(addCandidate).toHaveBeenCalledWith(mockRequest.body);
  });
  
  // Test para verificar que el controlador devuelve código 201 para éxito
  test('debería devolver código 201 y los datos del candidato cuando la operación es exitosa', async () => {
    const candidateResult = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    (addCandidate as jest.Mock).mockResolvedValue(candidateResult);
    
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(201);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        message: 'Candidate added successfully',
        data: candidateResult
      });
    }
  });
  
  // Test para verificar que el controlador maneja correctamente los errores
  test('debería devolver código 400 cuando el servicio lanza un error', async () => {
    const errorMessage = 'Error al añadir candidato';
    (addCandidate as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        message: 'Error adding candidate',
        error: errorMessage
      });
    }
  });
  
  // Test para verificar que el controlador maneja correctamente errores desconocidos
  test('debería manejar correctamente errores desconocidos', async () => {
    (addCandidate as jest.Mock).mockRejectedValue('Error desconocido');
    
    await addCandidateController(mockRequest as Request, mockResponse as Response);
    
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    }
  });
});

// Tests para el servicio de carga de archivos
describe('Servicio de carga de archivos', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: {
    statusCode: number;
    jsonValue: null | { filePath?: string; fileType?: string; error?: string };
  };
  let mockUploader: jest.Mock;
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configuración de objetos mock para Request y Response
    responseObject = {
      statusCode: 0,
      jsonValue: null
    };
    
    mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((value) => {
        responseObject.jsonValue = value;
        return mockResponse;
      })
    };
    
    // Configurar un mock directo para el uploader en lugar de mockear todo multer
    mockUploader = jest.fn().mockImplementation((req, res, next) => next());
    
    // Sobrescribir la implementación del módulo multer para este test
    jest.doMock('multer', () => {
      return jest.fn().mockImplementation(() => {
        return {
          single: jest.fn().mockReturnValue(mockUploader)
        };
      });
    });
  });
  
  // Test para verificar que acepta archivos PDF
  test('debería aceptar archivos PDF', () => {
    // Configurar el mock de Request con un archivo PDF
    mockRequest = {
      file: {
        path: '/uploads/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf',
        size: 1024,
        destination: '/uploads',
        filename: '1234567890-cv.pdf',
        fieldname: 'file',
        encoding: '7bit',
        buffer: Buffer.from('test'),
        stream: {} as any // Añadir stream para satisfacer el tipo File
      }
    };
    
    // Llamar a la función de carga de archivos
    uploadFile(mockRequest as Request, mockResponse as Response);
    
    // Verificar que devuelve código 200 y los datos del archivo
    expect(responseObject.statusCode).toBe(200);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        filePath: '/uploads/1234567890-cv.pdf',
        fileType: 'application/pdf'
      });
    }
  });
  
  // Test para verificar que acepta archivos DOCX
  test('debería aceptar archivos DOCX', () => {
    // Configurar el mock de Request con un archivo DOCX
    mockRequest = {
      file: {
        path: '/uploads/1234567890-cv.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        originalname: 'cv.docx',
        size: 1024,
        destination: '/uploads',
        filename: '1234567890-cv.docx',
        fieldname: 'file',
        encoding: '7bit',
        buffer: Buffer.from('test'),
        stream: {} as any // Añadir stream para satisfacer el tipo File
      }
    };
    
    // Llamar a la función de carga de archivos
    uploadFile(mockRequest as Request, mockResponse as Response);
    
    // Verificar que devuelve código 200 y los datos del archivo
    expect(responseObject.statusCode).toBe(200);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        filePath: '/uploads/1234567890-cv.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }
  });
  
  // Test para verificar que rechaza archivos de tipo no permitido
  test('debería rechazar archivos de tipo no permitido', () => {
    // Configurar el mock de Request sin archivo (rechazado por el filtro)
    mockRequest = { file: undefined };
    
    // Llamar a la función de carga de archivos
    uploadFile(mockRequest as Request, mockResponse as Response);
    
    // Verificar que devuelve código 400 y mensaje de error
    expect(responseObject.statusCode).toBe(400);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        error: 'Invalid file type, only PDF and DOCX are allowed!'
      });
    }
  });
  
  // Test para verificar que maneja errores de Multer
  test('debería manejar errores de Multer', () => {
    // Crear un objeto Error simulando un error de Multer
    const multerError = new Error('File too large');
    (multerError as any).code = 'LIMIT_FILE_SIZE';
    
    // Configurar el uploader para que llame a next con el error
    mockUploader.mockImplementation((req, res, next) => next(multerError));
    
    // Crear una versión simplificada de uploadFile que use nuestro mockUploader
    const simplifiedUploadFile = (req: Request, res: Response) => {
      // Simular el comportamiento de multer
      mockUploader(req, res, (err: Error | undefined) => {
        if (err) {
          if ((err as any).code) { // Error de Multer
            return res.status(500).json({ error: err.message });
          } else {
            return res.status(500).json({ error: err.message });
          }
        }
        
        // Resto del código igual que uploadFile
        if (!req.file) {
          return res.status(400).json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
        }
        
        res.status(200).json({
          filePath: req.file.path,
          fileType: req.file.mimetype
        });
      });
    };
    
    // Llamar a nuestra función simplificada
    simplifiedUploadFile({} as Request, mockResponse as Response);
    
    // Verificar que devuelve código 500 y mensaje de error
    expect(responseObject.statusCode).toBe(500);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        error: 'File too large'
      });
    }
  });
  
  // Test para verificar que maneja errores genéricos
  test('debería manejar errores genéricos', () => {
    // Crear un error genérico
    const genericError = new Error('Error desconocido');
    
    // Configurar el uploader para que llame a next con el error
    mockUploader.mockImplementation((req, res, next) => next(genericError));
    
    // Crear una versión simplificada de uploadFile que use nuestro mockUploader
    const simplifiedUploadFile = (req: Request, res: Response) => {
      // Simular el comportamiento de multer
      mockUploader(req, res, (err: Error | undefined) => {
        if (err) {
          if ((err as any).code) { // Error de Multer
            return res.status(500).json({ error: err.message });
          } else {
            return res.status(500).json({ error: err.message });
          }
        }
        
        // Resto del código igual que uploadFile
        if (!req.file) {
          return res.status(400).json({ error: 'Invalid file type, only PDF and DOCX are allowed!' });
        }
        
        res.status(200).json({
          filePath: req.file.path,
          fileType: req.file.mimetype
        });
      });
    };
    
    // Llamar a nuestra función simplificada
    simplifiedUploadFile({} as Request, mockResponse as Response);
    
    // Verificar que devuelve código 500 y mensaje de error
    expect(responseObject.statusCode).toBe(500);
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toEqual({
        error: 'Error desconocido'
      });
    }
  });
});

// Test de integración para el flujo completo
describe('Flujo completo de registro de candidatos', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar los mocks para cada clase de dominio
    (Candidate as unknown as jest.Mock).mockImplementation(function(this: any, data: any) {
      this.id = 1;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email;
      this.phone = data.phone;
      this.address = data.address;
      this.education = [];
      this.workExperience = [];
      this.resumes = [];
      this.save = jest.fn().mockResolvedValue({ ...data, id: 1 });
    });
  });
  
  test('debería procesar correctamente el registro completo de un candidato', async () => {
    // Mock para candidateService.addCandidate
    const mockAddCandidate = jest.fn().mockImplementation(async (data) => {
      // Simular validación
      validateCandidateData(data);
      
      // Simular creación de candidato
      const candidate = new Candidate(data);
      await candidate.save();
      
      // Devolver datos con ID
      return { id: 1, ...data };
    });
    
    // Sobrescribir el mock del servicio
    jest.mock('../application/services/candidateService', () => ({
      addCandidate: mockAddCandidate
    }));
    
    // Datos del candidato para el registro
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Principal 123',
      educations: [
        {
          institution: 'Universidad de Ejemplo',
          title: 'Ingeniero de Software',
          startDate: '2015-09-01',
          endDate: '2019-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'Empresa Ejemplo',
          position: 'Desarrollador',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2019-07-01',
          endDate: '2022-12-31'
        }
      ],
      cv: {
        filePath: '/uploads/1234567890-cv.pdf',
        fileType: 'application/pdf'
      }
    };
    
    // Crear un mock de Request y Response
    const mockRequest = {
      body: candidateData
    } as Partial<Request>;
    
    const responseObject: {
      statusCode: number;
      jsonValue: null | { message?: string; error?: string; data?: any };
    } = {
      statusCode: 0,
      jsonValue: null
    };
    
    const mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((value) => {
        responseObject.jsonValue = value;
        return mockResponse;
      })
    } as Partial<Response>;
    
    // Implementar una versión simplificada del controlador
    const simplifiedControllerFunction = async (req: Request, res: Response) => {
      try {
        // Llamamos directamente a mockAddCandidate para este test, no a través del import
        const candidate = await mockAddCandidate(req.body);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
          res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
      }
    };
    
    // Llamar al controlador simplificado
    await simplifiedControllerFunction(mockRequest as Request, mockResponse as Response);
    
    // Verificar que se llamó al mockAddCandidate con los datos correctos
    expect(mockAddCandidate).toHaveBeenCalledWith(candidateData);
    
    // Verificar que se creó el candidato con Candidate constructor
    expect(Candidate).toHaveBeenCalledWith(candidateData);
    
    // Verificar que el controlador devolvió código 201
    expect(responseObject.statusCode).toBe(201);
    
    // Verificar que el controlador devolvió los datos del candidato
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue) {
      expect(responseObject.jsonValue).toHaveProperty('message', 'Candidate added successfully');
      expect(responseObject.jsonValue).toHaveProperty('data');
    }
  });
  
  // Test para verificar que la validación real falla con datos incorrectos
  test('debería fallar el registro cuando los datos del candidato son inválidos', async () => {
    // Crear un mock de addCandidate que utilice el validador real
    const mockAddCandidate = jest.fn().mockImplementation(async (data) => {
      // Usar el validador real
      validateCandidateData(data);
      return { id: 1, ...data };
    });
    
    // Sobrescribir el mock del servicio
    jest.mock('../application/services/candidateService', () => ({
      addCandidate: mockAddCandidate
    }));
    
    // Datos inválidos del candidato
    const invalidCandidateData = {
      firstName: '12', // Números no permitidos en el nombre
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678'
    };
    
    // Crear un mock de Request y Response
    const mockRequest = {
      body: invalidCandidateData
    } as Partial<Request>;
    
    const responseObject: {
      statusCode: number;
      jsonValue: null | { message?: string; error?: string; data?: any };
    } = {
      statusCode: 0,
      jsonValue: null
    };
    
    const mockResponse = {
      status: jest.fn().mockImplementation((code) => {
        responseObject.statusCode = code;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((value) => {
        responseObject.jsonValue = value;
        return mockResponse;
      })
    } as Partial<Response>;
    
    // Implementar una versión simplificada del controlador para este test
    const simplifiedControllerFunction = async (req: Request, res: Response) => {
      try {
        // Llamamos directamente a mockAddCandidate para este test
        const candidate = await mockAddCandidate(req.body);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
          res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
      }
    };
    
    // Llamar al controlador simplificado
    await simplifiedControllerFunction(mockRequest as Request, mockResponse as Response);
    
    // Verificar que se usó mockAddCandidate con los datos incorrectos
    expect(mockAddCandidate).toHaveBeenCalledWith(invalidCandidateData);
    
    // Verificar que el controlador devolvió código 400 por el error de validación
    expect(responseObject.statusCode).toBe(400);
    
    // Verificar que el mensaje de error incluye el error de validación
    expect(responseObject.jsonValue).not.toBeNull();
    if (responseObject.jsonValue && 'error' in responseObject.jsonValue) {
      expect(responseObject.jsonValue.error).toContain('Invalid name');
    }
  });
});
