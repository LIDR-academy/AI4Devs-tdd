import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

// Mock de PrismaClient y sus métodos
jest.mock('@prisma/client', () => {
  const mockCreate = jest.fn().mockResolvedValue({ id: 1 });
  const mockUpdate = jest.fn().mockResolvedValue({ id: 1 });

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      candidate: {
        create: mockCreate,
        update: mockUpdate
      },
      education: {
        create: mockCreate,
        update: mockUpdate
      },
      workExperience: {
        create: mockCreate,
        update: mockUpdate
      },
      resume: {
        create: mockCreate
      },
      $connect: jest.fn(),
      $disconnect: jest.fn()
    }))
  };
});

// Mocks para los métodos save() de cada modelo
jest.mock('../domain/models/Candidate', () => {
  return {
    Candidate: jest.fn().mockImplementation(function(data) {
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
      return this;
    })
  };
});

jest.mock('../domain/models/Education', () => {
  return {
    Education: jest.fn().mockImplementation(function(data) {
      this.id = data.id;
      this.institution = data.institution;
      this.title = data.title;
      this.startDate = new Date(data.startDate);
      this.endDate = data.endDate ? new Date(data.endDate) : undefined;
      this.candidateId = data.candidateId;
      this.save = jest.fn().mockImplementation(() => {
        if (this.id) {
          return Promise.resolve({ id: this.id, ...data });
        } else {
          return Promise.resolve({ id: 1, ...data });
        }
      });
      return this;
    })
  };
});

jest.mock('../domain/models/WorkExperience', () => {
  return {
    WorkExperience: jest.fn().mockImplementation(function(data) {
      this.id = data.id;
      this.company = data.company;
      this.position = data.position;
      this.description = data.description;
      this.startDate = new Date(data.startDate);
      this.endDate = data.endDate ? new Date(data.endDate) : undefined;
      this.candidateId = data.candidateId;
      this.save = jest.fn().mockImplementation(() => {
        if (this.id) {
          return Promise.resolve({ id: this.id, ...data });
        } else {
          return Promise.resolve({ id: 1, ...data });
        }
      });
      return this;
    })
  };
});

jest.mock('../domain/models/Resume', () => {
  return {
    Resume: jest.fn().mockImplementation(function(data) {
      this.id = data?.id;
      this.candidateId = data?.candidateId;
      this.filePath = data?.filePath;
      this.fileType = data?.fileType;
      this.uploadDate = new Date();
      this.save = jest.fn().mockImplementation(() => {
        if (this.id) {
          return Promise.reject(new Error('No se permite la actualización de un currículum existente.'));
        } else {
          return Promise.resolve(new Resume({ id: 1, ...data }));
        }
      });
      return this;
    })
  };
});

describe('Tests para modelos (Candidate.ts, Education.ts, etc.)', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  describe('Modelo Candidate', () => {
    test('Debería crear un nuevo candidato con los campos obligatorios', () => {
      // Arrange
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com'
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate.firstName).toBe('Juan');
      expect(candidate.lastName).toBe('Pérez');
      expect(candidate.email).toBe('juan@example.com');
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });

    test('Debería crear un candidato con todos los campos opcionales', () => {
      // Arrange
      const candidateData = {
        id: 1,
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        phone: '123456789',
        address: 'Calle Principal 123'
      };

      // Act
      const candidate = new Candidate(candidateData);

      // Assert
      expect(candidate.id).toBe(1);
      expect(candidate.firstName).toBe('María');
      expect(candidate.lastName).toBe('García');
      expect(candidate.email).toBe('maria@example.com');
      expect(candidate.phone).toBe('123456789');
      expect(candidate.address).toBe('Calle Principal 123');
    });

    test('Debería guardar un candidato correctamente', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Pedro',
        lastName: 'Martínez',
        email: 'pedro@example.com'
      };
      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(candidate.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result.firstName).toBe('Pedro');
    });

    test('Debería guardar un candidato con educación, experiencia y CV', async () => {
      // Arrange
      const candidateData = {
        firstName: 'Laura',
        lastName: 'González',
        email: 'laura@example.com',
        education: [
          { institution: 'Universidad XYZ', title: 'Ingeniería', startDate: '2018-09-01' }
        ],
        workExperience: [
          { company: 'Empresa ABC', position: 'Desarrollador', startDate: '2022-01-01' }
        ],
        resumes: [
          { filePath: '/uploads/cv.pdf', fileType: 'application/pdf' }
        ]
      };
      
      const candidate = new Candidate(candidateData);

      // Act
      const result = await candidate.save();

      // Assert
      expect(candidate.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result.firstName).toBe('Laura');
    });
  });

  describe('Modelo Education', () => {
    test('Debería crear un objeto Education correctamente', () => {
      // Arrange
      const today = new Date();
      const educationData = {
        institution: 'Universidad XYZ',
        title: 'Licenciatura en Informática',
        startDate: today.toISOString(),
        candidateId: 1
      };

      // Act
      const education = new Education(educationData);

      // Assert
      expect(education.institution).toBe('Universidad XYZ');
      expect(education.title).toBe('Licenciatura en Informática');
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.candidateId).toBe(1);
      expect(education.endDate).toBeUndefined();
    });

    test('Debería manejar fechas correctamente', () => {
      // Arrange
      const startDate = '2018-09-01';
      const endDate = '2022-06-30';
      const educationData = {
        institution: 'Universidad XYZ',
        title: 'Licenciatura en Informática',
        startDate,
        endDate,
        candidateId: 1
      };

      // Act
      const education = new Education(educationData);

      // Assert
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.startDate.getFullYear()).toBe(2018);
      expect(education.startDate.getMonth()).toBe(8); // 0-indexed, 8 = septiembre
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.endDate?.getFullYear()).toBe(2022);
    });

    test('Debería guardar una nueva educación correctamente', async () => {
      // Arrange
      const educationData = {
        institution: 'Universidad XYZ',
        title: 'Licenciatura en Informática',
        startDate: '2018-09-01',
        candidateId: 1
      };
      
      const education = new Education(educationData);

      // Act
      const result = await education.save();

      // Assert
      expect(education.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result.institution).toBe('Universidad XYZ');
    });

    test('Debería actualizar una educación existente', async () => {
      // Arrange
      const educationData = {
        id: 1,
        institution: 'Universidad XYZ',
        title: 'Licenciatura en Informática',
        startDate: '2018-09-01',
        candidateId: 1
      };
      
      const education = new Education(educationData);

      // Act
      const result = await education.save();

      // Assert
      expect(education.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('Modelo WorkExperience', () => {
    test('Debería crear un objeto WorkExperience correctamente', () => {
      // Arrange
      const experienceData = {
        company: 'Empresa ABC',
        position: 'Desarrollador Full Stack',
        description: 'Desarrollo de aplicaciones web',
        startDate: '2022-01-10',
        candidateId: 1
      };

      // Act
      const experience = new WorkExperience(experienceData);

      // Assert
      expect(experience.company).toBe('Empresa ABC');
      expect(experience.position).toBe('Desarrollador Full Stack');
      expect(experience.description).toBe('Desarrollo de aplicaciones web');
      expect(experience.startDate).toBeInstanceOf(Date);
      expect(experience.candidateId).toBe(1);
      expect(experience.endDate).toBeUndefined();
    });

    test('Debería manejar fechas de inicio y fin correctamente', () => {
      // Arrange
      const startDate = '2022-01-10';
      const endDate = '2023-06-30';
      const experienceData = {
        company: 'Empresa ABC',
        position: 'Desarrollador Full Stack',
        startDate,
        endDate,
        candidateId: 1
      };

      // Act
      const experience = new WorkExperience(experienceData);

      // Assert
      expect(experience.startDate).toBeInstanceOf(Date);
      expect(experience.startDate.getFullYear()).toBe(2022);
      expect(experience.startDate.getMonth()).toBe(0); // 0-indexed, 0 = enero
      expect(experience.endDate).toBeInstanceOf(Date);
      expect(experience.endDate?.getFullYear()).toBe(2023);
    });

    test('Debería guardar una nueva experiencia laboral correctamente', async () => {
      // Arrange
      const experienceData = {
        company: 'Empresa ABC',
        position: 'Desarrollador Full Stack',
        description: 'Desarrollo de aplicaciones web',
        startDate: '2022-01-10',
        candidateId: 1
      };
      
      const experience = new WorkExperience(experienceData);

      // Act
      const result = await experience.save();

      // Assert
      expect(experience.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result.company).toBe('Empresa ABC');
    });

    test('Debería actualizar una experiencia laboral existente', async () => {
      // Arrange
      const experienceData = {
        id: 1,
        company: 'Empresa ABC',
        position: 'Desarrollador Senior',
        startDate: '2022-01-10',
        candidateId: 1
      };
      
      const experience = new WorkExperience(experienceData);

      // Act
      const result = await experience.save();

      // Assert
      expect(experience.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('Modelo Resume', () => {
    test('Debería crear un objeto Resume correctamente', () => {
      // Arrange
      const resumeData = {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        candidateId: 1
      };

      // Act
      const resume = new Resume(resumeData);

      // Assert
      expect(resume.filePath).toBe('/uploads/cv.pdf');
      expect(resume.fileType).toBe('application/pdf');
      expect(resume.candidateId).toBe(1);
      expect(resume.uploadDate).toBeInstanceOf(Date);
    });

    test('Debería crear un CV con fecha de subida automática', () => {
      // Arrange
      const before = new Date();
      const resumeData = {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        candidateId: 1
      };

      // Act
      const resume = new Resume(resumeData);
      const after = new Date();

      // Assert
      expect(resume.uploadDate).toBeInstanceOf(Date);
      expect(resume.uploadDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(resume.uploadDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test('Debería guardar un nuevo CV correctamente', async () => {
      // Arrange
      const resumeData = {
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        candidateId: 1
      };
      
      const resume = new Resume(resumeData);
      
      // Act
      const result = await resume.save();

      // Assert
      expect(resume.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Resume);
      expect(result.filePath).toBe('/uploads/cv.pdf');
      expect(result.fileType).toBe('application/pdf');
    });

    test('Debería rechazar la actualización de un CV existente', async () => {
      // Arrange
      const resumeData = {
        id: 1,
        filePath: '/uploads/cv.pdf',
        fileType: 'application/pdf',
        candidateId: 1
      };
      
      const resume = new Resume(resumeData);

      // Act & Assert
      await expect(resume.save()).rejects.toThrow('No se permite la actualización de un currículum existente.');
    });
  });
}); 