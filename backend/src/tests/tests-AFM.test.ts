import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { addCandidate } from '../application/services/candidateService';

const prisma = new PrismaClient();
const app = express();
app.use(json());

// Función de validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función de validación de teléfono
const isValidPhone = (phone: string): boolean => {
  // Formato: +XX XXXX-XXXX o XXXX-XXXX
  const phoneRegex = /^(\+\d{2}\s)?\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Función de validación de datos del candidato
const validateCandidateData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar campos requeridos
  if (!data.firstName) {
    errors.push('firstName is required');
  }
  if (!data.lastName) {
    errors.push('lastName is required');
  }
  if (!data.email) {
    errors.push('email is required');
  }

  // Validar tipos de datos
  if (data.firstName && typeof data.firstName !== 'string') {
    errors.push('firstName must be a string');
  }
  if (data.lastName && typeof data.lastName !== 'string') {
    errors.push('lastName must be a string');
  }

  // Validar formato de email
  if (data.email && !isValidEmail(data.email)) {
    errors.push('email must be a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Endpoint handler
app.post('/candidates', async (req: Request, res: Response) => {
  const validation = validateCandidateData(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors
    });
  }

  try {
    // Aquí iría la lógica para guardar en la base de datos
    return res.status(201).json({
      success: true,
      data: req.body
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

describe('AFM Test Suite', () => {
  beforeAll(async () => {
    // Configuración inicial para los tests
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Candidate Service Tests', () => {
    it('should throw error when firstName is missing', async () => {
      const candidateData = {
        lastName: 'Doe',
        email: `test-${Date.now()}-1@example.com`
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should throw error when lastName is missing', async () => {
      const candidateData = {
        firstName: 'John',
        email: `test-${Date.now()}-2@example.com`
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should throw error when email is missing', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe'
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should throw error when email format is invalid', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email'
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should accept valid phone format', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test-${Date.now()}-3@example.com`,
        phone: '612345678' // Formato válido: empieza con 6, 7 o 9 y tiene 9 dígitos
      };
      
      const result = await addCandidate(candidateData);
      expect(result).toBeDefined();
      expect(result.phone).toBe(candidateData.phone);
    });

    it('should throw error when phone format is invalid', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test-${Date.now()}-4@example.com`,
        phone: '12345678' // Formato inválido: no empieza con 6, 7 o 9
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should throw error when phone has wrong length', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test-${Date.now()}-5@example.com`,
        phone: '61234567' // Formato inválido: solo 8 dígitos
      };
      
      await expect(addCandidate(candidateData)).rejects.toThrow();
    });

    it('should successfully add a candidate with valid data including phone', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test-${Date.now()}-6@example.com`,
        phone: '612345678' // Formato válido
      };
      
      const result = await addCandidate(candidateData);
      expect(result).toBeDefined();
      expect(result.firstName).toBe(candidateData.firstName);
      expect(result.lastName).toBe(candidateData.lastName);
      expect(result.email).toBe(candidateData.email);
      expect(result.phone).toBe(candidateData.phone);
    });

    describe('Education Validation Tests', () => {
      it('should throw error when education title is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-7@example.com`,
          educations: [{
            institution: 'University',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should throw error when education institution is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-8@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should throw error when education startDate is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-9@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should accept education without endDate', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-10@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            startDate: '2020-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });

      it('should accept education with endDate after startDate', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-11@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });

      it('should successfully add a candidate with valid education data', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-12@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });
    });

    describe('Work Experience Validation Tests', () => {
      it('should throw error when work experience position is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-13@example.com`,
          workExperiences: [{
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should throw error when work experience company is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-14@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should throw error when work experience startDate is missing', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-15@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            endDate: '2024-01-01'
          }]
        };
        
        await expect(addCandidate(candidateData)).rejects.toThrow();
      });

      it('should accept work experience without endDate', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-16@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });

      it('should accept work experience with endDate after startDate', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-17@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });

      it('should successfully add a candidate with valid work experience data', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-18@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        const result = await addCandidate(candidateData);
        expect(result).toBeDefined();
        expect(result.firstName).toBe(candidateData.firstName);
        expect(result.lastName).toBe(candidateData.lastName);
        expect(result.email).toBe(candidateData.email);
      });
    });

    describe('Database Operations Tests', () => {
      it('should save and retrieve a candidate from database', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-19@example.com`,
          phone: '612345678'
        };
        
        // Guardar el candidato
        const savedCandidate = await addCandidate(candidateData);
        expect(savedCandidate).toBeDefined();
        expect(savedCandidate.firstName).toBe(candidateData.firstName);
        expect(savedCandidate.lastName).toBe(candidateData.lastName);
        expect(savedCandidate.email).toBe(candidateData.email);
        expect(savedCandidate.phone).toBe(candidateData.phone);

        // Recuperar el candidato de la base de datos
        const retrievedCandidate = await prisma.candidate.findUnique({
          where: { id: savedCandidate.id }
        });

        expect(retrievedCandidate).toBeDefined();
        expect(retrievedCandidate?.firstName).toBe(candidateData.firstName);
        expect(retrievedCandidate?.lastName).toBe(candidateData.lastName);
        expect(retrievedCandidate?.email).toBe(candidateData.email);
        expect(retrievedCandidate?.phone).toBe(candidateData.phone);
      });

      it('should save and retrieve a candidate with education from database', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-20@example.com`,
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        // Guardar el candidato
        const savedCandidate = await addCandidate(candidateData);
        expect(savedCandidate).toBeDefined();

        // Recuperar el candidato con su educación
        const retrievedCandidate = await prisma.candidate.findUnique({
          where: { id: savedCandidate.id },
          include: { educations: true }
        });

        expect(retrievedCandidate).toBeDefined();
        expect(retrievedCandidate?.educations).toHaveLength(1);
        
        const education = retrievedCandidate?.educations[0];
        expect(education).toBeDefined();
        if (education) {
          expect(education.title).toBe(candidateData.educations[0].title);
          expect(education.institution).toBe(candidateData.educations[0].institution);
          expect(education.startDate.toISOString().split('T')[0]).toBe(candidateData.educations[0].startDate);
          if (education.endDate) {
            expect(education.endDate.toISOString().split('T')[0]).toBe(candidateData.educations[0].endDate);
          }
        }
      });

      it('should save and retrieve a candidate with work experience from database', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-21@example.com`,
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        // Guardar el candidato
        const savedCandidate = await addCandidate(candidateData);
        expect(savedCandidate).toBeDefined();

        // Recuperar el candidato con su experiencia laboral
        const retrievedCandidate = await prisma.candidate.findUnique({
          where: { id: savedCandidate.id },
          include: { workExperiences: true }
        });

        expect(retrievedCandidate).toBeDefined();
        expect(retrievedCandidate?.workExperiences).toHaveLength(1);
        
        const workExperience = retrievedCandidate?.workExperiences[0];
        expect(workExperience).toBeDefined();
        if (workExperience) {
          expect(workExperience.position).toBe(candidateData.workExperiences[0].position);
          expect(workExperience.company).toBe(candidateData.workExperiences[0].company);
          expect(workExperience.startDate.toISOString().split('T')[0]).toBe(candidateData.workExperiences[0].startDate);
          if (workExperience.endDate) {
            expect(workExperience.endDate.toISOString().split('T')[0]).toBe(candidateData.workExperiences[0].endDate);
          }
        }
      });

      it('should save and retrieve a candidate with complete profile from database', async () => {
        const candidateData = {
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}-22@example.com`,
          phone: '612345678',
          educations: [{
            title: 'Bachelor Degree',
            institution: 'University',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }],
          workExperiences: [{
            position: 'Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
          }]
        };
        
        // Guardar el candidato
        const savedCandidate = await addCandidate(candidateData);
        expect(savedCandidate).toBeDefined();

        // Recuperar el candidato con todos sus datos
        const retrievedCandidate = await prisma.candidate.findUnique({
          where: { id: savedCandidate.id },
          include: {
            educations: true,
            workExperiences: true
          }
        });

        expect(retrievedCandidate).toBeDefined();
        expect(retrievedCandidate?.firstName).toBe(candidateData.firstName);
        expect(retrievedCandidate?.lastName).toBe(candidateData.lastName);
        expect(retrievedCandidate?.email).toBe(candidateData.email);
        expect(retrievedCandidate?.phone).toBe(candidateData.phone);

        // Verificar educación
        expect(retrievedCandidate?.educations).toHaveLength(1);
        expect(retrievedCandidate?.educations[0].title).toBe(candidateData.educations[0].title);
        expect(retrievedCandidate?.educations[0].institution).toBe(candidateData.educations[0].institution);

        // Verificar experiencia laboral
        expect(retrievedCandidate?.workExperiences).toHaveLength(1);
        expect(retrievedCandidate?.workExperiences[0].position).toBe(candidateData.workExperiences[0].position);
        expect(retrievedCandidate?.workExperiences[0].company).toBe(candidateData.workExperiences[0].company);
      });
    });
  });
}); 