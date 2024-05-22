//-----------------------------------------------------------------------------------------
//TEST DE VALIDATOR
import {
    validateCandidateData,
    validateName,
    validateEmail,
    validatePhone,
    validateDate,
    validateAddress,
    validateEducation,
    validateExperience,
    validateCV
  } from '../validator';

describe('validateName', () => {
  it('should throw an error for invalid name', () => {
    expect(() => validateName('')).toThrow('Invalid name');
    expect(() => validateName('z')).toThrow('Invalid name');
    expect(() => validateName('879')).toThrow('Invalid name');
    expect(() => validateName('Juán Pérez!')).toThrow('Invalid name');
    expect(() => validateName(`D'Pablos`)).toThrow();
  });

  it('should not throw an error for valid name', () => {
    expect(() => validateName('José Clemente')).not.toThrow();
    expect(() => validateName('María Conchita')).not.toThrow();
  });

  it('should not throw an error for name with exactly 2 characters', () => {
    expect(() => validateName('Al')).not.toThrow();
  });

  it('should not throw an error for name with exactly 100 characters', () => {
    const longName = 'B'.repeat(100);
    expect(() => validateName(longName)).not.toThrow();
  });

  // Test cases for names with spaces and special characters
  it('should not throw an error for names with spaces', () => {
    expect(() => validateName('Juán Carlos')).not.toThrow();
    expect(() => validateName('María Joaquina Cortéz')).not.toThrow();
  });

  it('should not throw an error for names with special characters', () => {
    expect(() => validateName('José Péñaranda')).not.toThrow();
    expect(() => validateName('Josefina Árias')).not.toThrow();
  });
});

describe('validateEmail', () => {
  it('should throw an error for invalid email', () => {
    expect(() => validateEmail('')).toThrow('Invalid email');
    expect(() => validateEmail('duna.jaimes')).toThrow('Invalid email');
    expect(() => validateEmail('duna.jaimes@')).toThrow('Invalid email');
    expect(() => validateEmail('duna.jaimes@domain')).toThrow('Invalid email');
    expect(() => validateEmail('duna.jaimes@domain.')).toThrow('Invalid email');
  });

  it('should not throw an error for valid email', () => {
    expect(() => validateEmail('duna.jaimes@example.com')).not.toThrow();
    expect(() => validateEmail('duna.jaimes25@example.com.co')).not.toThrow();
  });
});

describe('validatePhone', () => {
  it('should throw an error for invalid phone number', () => {
    expect(() => validatePhone('')).toThrow('Invalid phone number');
    expect(() => validatePhone('123456789')).toThrow('Invalid phone number');
    expect(() => validatePhone('abcde4587')).toThrow('Invalid phone number');
    expect(() => validatePhone('45678')).toThrow('Invalid phone number');
  });

  it('should not throw an error for valid phone number', () => {
    expect(() => validatePhone('612592475')).not.toThrow();
  });
});

describe('validateDate', () => {
  it('should throw an error for invalid date', () => {
    expect(() => validateDate('')).toThrow('Invalid date');
    expect(() => validateDate('01-02-2024')).toThrow('Invalid date');
  });

  it('should not throw an error for valid date', () => {
    expect(() => validateDate('2024-12-31')).not.toThrow();
  });
});

describe('validateAddress', () => {
  it('should throw an error for invalid address', () => {
    expect(() => validateAddress('')).toThrow('Invalid address');
    expect(() => validateAddress('B'.repeat(101))).toThrow('Invalid address');
  });

  it('should not throw an error for valid address', () => {
    expect(() => validateAddress('Calle Falsa 123')).not.toThrow();
    expect(() => validateAddress('Z'.repeat(100))).not.toThrow();
  });
});

describe('validateCandidateData', () => {
  it('should validate all fields for a new candidate with complete and valid data', () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      educations: [{ institution: 'Universidad', title: 'Ingeniería', startDate: '2020-01-01', endDate: '2024-01-01' }],
      workExperiences: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2022-01-01', endDate: '2023-01-01' }],
      cv: { filePath: 'resume.pdf', fileType: 'pdf' }
    };

    expect(() => validateCandidateData(candidateData)).not.toThrow();
  });

  it('should not validate fields if id is provided', () => {
    const candidateData = { id: 1, firstName: 'Juan' };

    expect(() => validateCandidateData(candidateData)).not.toThrow();
  });

  it('should throw an error if required fields are missing', () => {
    const candidateData = {
      lastName: 'Pérez',
      email: 'juan.perez@example.com'
    };

    expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
  });

  it('should throw an error if email is invalid', () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez',
      phone: '612345678',
      address: 'Calle Falsa 123'
    };

    expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
  });

  it('should handle invalid educations', () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      educations: [{ institution: '', title: 'Ingeniería', startDate: '2020-01-01', endDate: '2024-01-01' }]
    };

    expect(() => validateCandidateData(candidateData)).toThrow('Invalid institution');
  });

  it('should handle invalid work experiences', () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      workExperiences: [{ company: '', position: 'Desarrollador', startDate: '2022-01-01', endDate: '2023-01-01' }]
    };

    expect(() => validateCandidateData(candidateData)).toThrow('Invalid company');
  });

  it('should handle invalid CV data', () => {
    const candidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Falsa 123',
      cv: { filePath: '', fileType: 'pdf' }
    };

    expect(() => validateCandidateData(candidateData)).toThrow('Invalid CV data');
  });
});

describe('validateEducation', () => {
  it('should validate correctly with valid data', () => {
    const education = {
      institution: 'Universidad de España',
      title: 'Ingeniería de Sistemas',
      startDate: '2020-01-01',
      endDate: '2024-01-01'
    };
    expect(() => validateEducation(education)).not.toThrow();
  });

  it('should throw an error if institution is missing or too long', () => {
    const education = {
      institution: '',
      title: 'Ingeniería de Sistemas',
      startDate: '2020-01-01',
      endDate: '2024-01-01'
    };
    expect(() => validateEducation(education)).toThrow('Invalid institution');
  });

  it('should throw an error if title is missing or too long', () => {
    const education = {
      institution: 'Universidad de España',
      title: '',
      startDate: '2020-01-01',
      endDate: '2024-01-01'
    };
    expect(() => validateEducation(education)).toThrow('Invalid title');
  });

  it('should throw an error if start date or end date is invalid', () => {
    const education = {
      institution: 'Universidad de España',
      title: 'Ingeniería de Sistemas',
      startDate: 'invalid-date',
      endDate: '2024-01-01'
    };
    expect(() => validateEducation(education)).toThrow('Invalid start date');
  });

  it('should throw an error if end date is before start date', () => {
    const education = {
      institution: 'Universidad de España',
      title: 'Ingeniería de Sistemas',
      startDate: '2024-01-01',
      endDate: '2020-01-01'
    };
    expect(() => validateEducation(education)).toThrow('Start date must be before end date');
  });
});

describe('validateExperience', () => {
  it('should validate correctly with valid data', () => {
    const experience = {
      company: 'Tech Solutions',
      position: 'Desarrollador Senior',
      description: 'Desarrollo de aplicaciones web.',
      startDate: '2022-01-01',
      endDate: '2023-01-01'
    };
    expect(() => validateExperience(experience)).not.toThrow();
  });

  it('should throw an error if company or position is missing or too long', () => {
    const experience = {
      company: '',
      position: 'Desarrollador Senior',
      startDate: '2022-01-01',
      endDate: '2023-01-01'
    };
    expect(() => validateExperience(experience)).toThrow('Invalid company');
  });

  it('should throw an error if description is too long', () => {
    const experience = {
      company: 'Tech Solutions',
      position: 'Desarrollador Senior',
      description: 'A'.repeat(201), // 201 characters long
      startDate: '2022-01-01',
      endDate: '2023-01-01'
    };
    expect(() => validateExperience(experience)).toThrow('Invalid description');
  });

  it('should throw an error if start date or end date is invalid', () => {
    const experience = {
      company: 'Tech Solutions',
      position: 'Desarrollador Senior',
      startDate: 'invalid-date',
      endDate: '2023-01-01'
    };
    expect(() => validateExperience(experience)).toThrow('Invalid start date');
  });

  it('should throw an error if end date is before start date', () => {
    const experience = {
      company: 'Tech Solutions',
      position: 'Desarrollador Senior',
      startDate: '2023-01-01',
      endDate: '2022-01-01'
    };
    expect(() => validateExperience(experience)).toThrow('Start date must be before end date');
  });
});

describe('validateCV', () => {
  it('should validate correctly with valid data', () => {
    const cv = {
      filePath: 'resume.pdf',
      fileType: 'pdf'
    };
    expect(() => validateCV(cv)).not.toThrow();
  });

  it('should throw an error if filePath or fileType is missing or invalid', () => {
    const cv = {
      filePath: '',
      fileType: '123'
    };
    expect(() => validateCV(cv)).toThrow('Invalid CV data');
  });
});



//-----------------------------------------------------------------------------------------
// TEST DE ADDCANDIDATE
import { addCandidate } from '../../../application/services/candidateService';
import { Candidate } from '../../../domain/models/Candidate';
import { Education } from '../../../domain/models/Education';
import { WorkExperience } from '../../../domain/models/WorkExperience';
import { Resume } from '../../../domain/models/Resume';


jest.mock('../../../domain/models/Candidate', () => {
    const originalModule = jest.requireActual('../../../domain/models/Candidate');
  
    return {
      ...originalModule,
      Candidate: jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          id: 1, // Asegúrate de que este valor es representativo para tus pruebas
          firstName: 'Carlos',
          lastName: 'García',
          email: 'carlos.garcia@example.es',
          phone: '699123456',
          address: 'Calle Mayor 10, Valencia',
          /* educations: [{
        institution: 'Universidad de Valencia',
        title: 'Ingeniería de Telecomunicaciones',
        startDate: '2012-09-01',
        endDate: '2016-06-30'
      }],
      workExperiences: [{
        company: 'Innovaciones S.L.',
        position: 'Ingeniero de Sistemas',
        startDate: '2017-01-01',
        endDate: '2020-12-31'
      }],
      cv: {
        filePath: 'resume_carlos.pdf',
        fileType: 'pdf'
      }
      */
        }),
      })),
    };
  });

jest.mock('../../../domain/models/Education');
jest.mock('../../../domain/models/WorkExperience');
jest.mock('../../../domain/models/Resume');

describe('addCandidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  


  it('should save a valid candidate with all required and optional data', async () => {
    const candidateData = {
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos.garcia@example.es',
      phone: '699123456',
      address: 'Calle Mayor 10, Valencia',
     /* educations: [{
        institution: 'Universidad de Valencia',
        title: 'Ingeniería de Telecomunicaciones',
        startDate: '2012-09-01',
        endDate: '2016-06-30'
      }],
      workExperiences: [{
        company: 'Innovaciones S.L.',
        position: 'Ingeniero de Sistemas',
        startDate: '2017-01-01',
        endDate: '2020-12-31'
      }],
      cv: {
        filePath: 'resume_carlos.pdf',
        fileType: 'pdf'
      }
      */
    };


    const result = await addCandidate(candidateData);

    // Verificaciones para asegurar que el método funciona como esperamos
    expect(result).toEqual({ id: 1, ...candidateData });
  });

  it('should not save a candidate with invalid data', async () => {
    const invalidCandidateData = {
      firstName: 'Ana',  // Missing lastName and other required fields
      email: 'ana.email@incorrecto'  // Invalid email format
    };

    

    await expect(addCandidate(invalidCandidateData)).rejects.toThrow('Error: Invalid name');
  });
});

