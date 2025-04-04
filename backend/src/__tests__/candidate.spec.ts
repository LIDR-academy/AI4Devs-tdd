import { insertCandidate } from '../application/services/candidateService';
import { prismaMock } from './mocks/prismaMock';
import { mockReset } from 'jest-mock-extended';

describe('Insert Candidate', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it('should insert a candidate into the database', async () => {
    // Arrange
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678',
      address: '123 Main St',
      educations: [],
      workExperiences: [],
      cv: {}
    };

    // Configurar el mock para simular una conexión exitosa
    prismaMock.candidate.create.mockResolvedValue({
      id: 1,
      ...candidateData
    });

    // Mockear la conexión a la base de datos
    jest.spyOn(prismaMock, '$connect').mockResolvedValue();

    // Act
    const result = await insertCandidate(candidateData);

    // Assert
    expect(result).toEqual({ id: 1, ...candidateData });
    expect(prismaMock.candidate.create).toHaveBeenCalledWith({
      data: candidateData,
    });
  });
});