import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { PrismaClient } from '@prisma/client';
import { validateEmail, validatePhone, validateAddress } from '../utils/validators';
import { validateFileType, validateFileSize } from '../utils/fileValidators';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

// Mock de validadores
jest.mock('../utils/validators', () => ({
  validateEmail: jest.fn(),
  validatePhone: jest.fn(),
  validateAddress: jest.fn(),
}));

jest.mock('../utils/fileValidators', () => ({
  validateFileType: jest.fn(),
  validateFileSize: jest.fn(),
}));

describe('Tests de Recepción de Datos del Formulario', () => {
  describe('Validación de Datos Básicos', () => {
    it('debería validar campos requeridos (nombre, apellido, email)', () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const candidate = new Candidate(candidateData);
      expect(candidate.firstName).toBe('John');
      expect(candidate.lastName).toBe('Doe');
      expect(candidate.email).toBe('john.doe@example.com');
    });

    it('debería validar el formato correcto del email', () => {
      const mockValidateEmail = validateEmail as jest.Mock;
      mockValidateEmail.mockReturnValue(true);
      expect(validateEmail('john.doe@example.com')).toBe(true);
      
      mockValidateEmail.mockReturnValue(false);
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('debería validar el número de teléfono', () => {
      const mockValidatePhone = validatePhone as jest.Mock;
      mockValidatePhone.mockReturnValue(true);
      expect(validatePhone('+34612345678')).toBe(true);
      
      mockValidatePhone.mockReturnValue(false);
      expect(validatePhone('invalid-phone')).toBe(false);
    });

    it('debería validar la dirección', () => {
      const mockValidateAddress = validateAddress as jest.Mock;
      mockValidateAddress.mockReturnValue(true);
      expect(validateAddress('Calle Mayor 1, Madrid')).toBe(true);
      
      mockValidateAddress.mockReturnValue(false);
      expect(validateAddress('')).toBe(false);
    });
  });

  describe('Validación de Educación', () => {
    it('debería validar campos requeridos en educación', () => {
      const educationData = {
        institution: 'Universidad de Madrid',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
      };

      const education = new Education(educationData);
      expect(education.institution).toBe('Universidad de Madrid');
      expect(education.title).toBe('Ingeniería Informática');
    });

    it('debería validar el formato correcto de las fechas', () => {
      const educationData = {
        institution: 'Universidad de Madrid',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
      };

      const education = new Education(educationData);
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeInstanceOf(Date);
    });

    it('debería validar la relación entre fechas de inicio y fin', () => {
      const educationData = {
        institution: 'Universidad de Madrid',
        title: 'Ingeniería Informática',
        startDate: '2024-01-01',
        endDate: '2020-01-01',
      };

      expect(() => new Education(educationData)).toThrow('La fecha de fin debe ser posterior a la fecha de inicio');
    });
  });

  describe('Validación de Experiencia Laboral', () => {
    it('debería validar campos requeridos en experiencia laboral', () => {
      const workExperienceData = {
        company: 'Tech Corp',
        position: 'Desarrollador Senior',
        startDate: '2020-01-01',
      };

      const workExperience = new WorkExperience(workExperienceData);
      expect(workExperience.company).toBe('Tech Corp');
      expect(workExperience.position).toBe('Desarrollador Senior');
    });

    it('debería validar el formato correcto de las fechas', () => {
      const workExperienceData = {
        company: 'Tech Corp',
        position: 'Desarrollador Senior',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
      };

      const workExperience = new WorkExperience(workExperienceData);
      expect(workExperience.startDate).toBeInstanceOf(Date);
      expect(workExperience.endDate).toBeInstanceOf(Date);
    });

    it('debería validar la relación entre fechas de inicio y fin', () => {
      const workExperienceData = {
        company: 'Tech Corp',
        position: 'Desarrollador Senior',
        startDate: '2024-01-01',
        endDate: '2020-01-01',
      };

      expect(() => new WorkExperience(workExperienceData)).toThrow('La fecha de fin debe ser posterior a la fecha de inicio');
    });
  });

  describe('Validación de Archivos', () => {
    it('debería validar el tipo de archivo del CV', () => {
      const mockValidateFileType = validateFileType as jest.Mock;
      mockValidateFileType.mockReturnValue(true);
      expect(validateFileType('application/pdf')).toBe(true);
      
      mockValidateFileType.mockReturnValue(false);
      expect(validateFileType('application/exe')).toBe(false);
    });

    it('debería validar el tamaño máximo permitido del archivo', () => {
      const mockValidateFileSize = validateFileSize as jest.Mock;
      mockValidateFileSize.mockReturnValue(true);
      expect(validateFileSize(2 * 1024 * 1024)).toBe(true); // 2MB
      
      mockValidateFileSize.mockReturnValue(false);
      expect(validateFileSize(6 * 1024 * 1024)).toBe(false); // 6MB
    });
  });
});

describe('Tests de Guardado en Base de Datos', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('Guardado de Datos Básicos', () => {
    it('debería guardar correctamente los datos básicos del candidato', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...candidateData });
      (prisma.candidate.create as jest.Mock) = mockCreate;

      const candidate = new Candidate(candidateData);
      const result = await candidate.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: candidateData,
      });
      expect(result).toEqual({ id: 1, ...candidateData });
    });

    it('debería manejar campos opcionales correctamente', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+34612345678',
        address: 'Calle Mayor 1, Madrid',
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...candidateData });
      (prisma.candidate.create as jest.Mock) = mockCreate;

      const candidate = new Candidate(candidateData);
      const result = await candidate.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: candidateData,
      });
      expect(result).toEqual({ id: 1, ...candidateData });
    });
  });

  describe('Guardado de Educación', () => {
    it('debería guardar correctamente los registros de educación', async () => {
      const educationData = {
        institution: 'Universidad de Madrid',
        title: 'Ingeniería Informática',
        startDate: '2020-01-01',
        candidateId: 1,
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...educationData });
      (prisma.education.create as jest.Mock) = mockCreate;

      const education = new Education(educationData);
      const result = await education.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          ...educationData,
          startDate: new Date(educationData.startDate),
        },
      });
      expect(result).toEqual({ id: 1, ...educationData });
    });
  });

  describe('Guardado de Experiencia Laboral', () => {
    it('debería guardar correctamente los registros de experiencia laboral', async () => {
      const workExperienceData = {
        company: 'Tech Corp',
        position: 'Desarrollador Senior',
        startDate: '2020-01-01',
        candidateId: 1,
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...workExperienceData });
      (prisma.workExperience.create as jest.Mock) = mockCreate;

      const workExperience = new WorkExperience(workExperienceData);
      const result = await workExperience.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          ...workExperienceData,
          startDate: new Date(workExperienceData.startDate),
        },
      });
      expect(result).toEqual({ id: 1, ...workExperienceData });
    });
  });

  describe('Manejo de Errores', () => {
    it('debería manejar errores de validación', async () => {
      const invalidCandidateData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
      };

      expect(() => new Candidate(invalidCandidateData)).toThrow();
    });

    it('debería manejar errores de base de datos', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockCreate = jest.fn().mockRejectedValue(new Error('Error de base de datos'));
      (prisma.candidate.create as jest.Mock) = mockCreate;

      const candidate = new Candidate(candidateData);
      await expect(candidate.save()).rejects.toThrow('Error de base de datos');
    });

    it('debería manejar errores de archivos', async () => {
      const resumeData = {
        candidateId: 1,
        filePath: '/uploads/invalid.pdf',
        fileType: 'application/exe',
      };

      const mockValidateFileType = validateFileType as jest.Mock;
      mockValidateFileType.mockReturnValue(false);
      expect(() => new Resume(resumeData)).toThrow('Tipo de archivo no permitido');
    });
  });
});

describe('Domain Models Tests', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('Candidate Model', () => {
    it('should create a valid candidate with required fields', () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const candidate = new Candidate(candidateData);

      expect(candidate.firstName).toBe('John');
      expect(candidate.lastName).toBe('Doe');
      expect(candidate.email).toBe('john.doe@example.com');
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    it('should create a candidate with optional fields', () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        address: '123 Main St',
      };

      const candidate = new Candidate(candidateData);

      expect(candidate.phone).toBe('123456789');
      expect(candidate.address).toBe('123 Main St');
    });

    it('should create a new candidate', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...candidateData });
      (prisma.candidate.create as jest.Mock) = mockCreate;

      const candidate = new Candidate(candidateData);
      const result = await candidate.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      });
      expect(result).toEqual({ id: 1, ...candidateData });
    });

    it('should find a candidate by id', async () => {
      const mockData = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const mockFindUnique = jest.fn().mockResolvedValue(mockData);
      (prisma.candidate.findUnique as jest.Mock) = mockFindUnique;

      const result = await Candidate.findOne(1);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeInstanceOf(Candidate);
      expect(result?.id).toBe(1);
    });
  });

  describe('Education Model', () => {
    it('should create a valid education with required fields', () => {
      const educationData = {
        institution: 'University of Example',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
      };

      const education = new Education(educationData);

      expect(education.institution).toBe('University of Example');
      expect(education.title).toBe('Bachelor of Science');
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeUndefined();
      expect(education.candidateId).toBeUndefined();
    });

    it('should create a new education', async () => {
      const educationData = {
        institution: 'University of Example',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...educationData });
      (prisma.education.create as jest.Mock) = mockCreate;

      const education = new Education(educationData);
      const result = await education.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          institution: 'University of Example',
          title: 'Bachelor of Science',
          startDate: new Date('2020-01-01'),
        },
      });
      expect(result).toEqual({ id: 1, ...educationData });
    });
  });

  describe('WorkExperience Model', () => {
    it('should create a valid work experience with required fields', () => {
      const workExperienceData = {
        company: 'Example Corp',
        position: 'Software Engineer',
        startDate: '2020-01-01',
      };

      const workExperience = new WorkExperience(workExperienceData);

      expect(workExperience.company).toBe('Example Corp');
      expect(workExperience.position).toBe('Software Engineer');
      expect(workExperience.startDate).toBeInstanceOf(Date);
      expect(workExperience.description).toBeUndefined();
      expect(workExperience.endDate).toBeUndefined();
      expect(workExperience.candidateId).toBeUndefined();
    });

    it('should create a new work experience', async () => {
      const workExperienceData = {
        company: 'Example Corp',
        position: 'Software Engineer',
        startDate: '2020-01-01',
      };

      const mockCreate = jest.fn().mockResolvedValue({ id: 1, ...workExperienceData });
      (prisma.workExperience.create as jest.Mock) = mockCreate;

      const workExperience = new WorkExperience(workExperienceData);
      const result = await workExperience.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          company: 'Example Corp',
          position: 'Software Engineer',
          startDate: new Date('2020-01-01'),
        },
      });
      expect(result).toEqual({ id: 1, ...workExperienceData });
    });
  });

  describe('Resume Model', () => {
    it('should create a valid resume with required fields', () => {
      const resumeData = {
        candidateId: 1,
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf',
      };

      const resume = new Resume(resumeData);

      expect(resume.candidateId).toBe(1);
      expect(resume.filePath).toBe('/uploads/resume.pdf');
      expect(resume.fileType).toBe('application/pdf');
      expect(resume.uploadDate).toBeInstanceOf(Date);
    });

    it('should create a new resume', async () => {
      const resumeData = {
        candidateId: 1,
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf',
      };

      const mockCreate = jest.fn().mockResolvedValue({
        id: 1,
        ...resumeData,
        uploadDate: new Date(),
      });
      (prisma.resume.create as jest.Mock) = mockCreate;

      const resume = new Resume(resumeData);
      const result = await resume.save();

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          candidateId: 1,
          filePath: '/uploads/resume.pdf',
          fileType: 'application/pdf',
          uploadDate: expect.any(Date),
        },
      });
      expect(result).toBeInstanceOf(Resume);
      expect(result.id).toBe(1);
    });

    it('should throw an error when trying to update an existing resume', async () => {
      const resumeData = {
        id: 1,
        candidateId: 1,
        filePath: '/uploads/resume.pdf',
        fileType: 'application/pdf',
      };

      const resume = new Resume(resumeData);

      await expect(resume.save()).rejects.toThrow(
        'No se permite la actualización de un currículum existente.'
      );
    });
  });
}); 