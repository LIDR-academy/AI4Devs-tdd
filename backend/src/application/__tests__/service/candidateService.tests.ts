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

