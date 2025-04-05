import { addCandidate } from '../candidateService';
import { Candidate } from '../../../domain/models/Candidate';
import { Education } from '../../../domain/models/Education';
import { WorkExperience } from '../../../domain/models/WorkExperience';
import { Resume } from '../../../domain/models/Resume';
import { validateCandidateData } from '../../validator';

jest.mock('../../../domain/models/Candidate');
jest.mock('../../../domain/models/Education');
jest.mock('../../../domain/models/WorkExperience');
jest.mock('../../../domain/models/Resume');
jest.mock('../../validator');

describe('CandidateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addCandidate', () => {
    it('should create a candidate successfully', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        save: jest.fn().mockResolvedValue({ id: 1 })
      };

      (Candidate as unknown as jest.Mock).mockImplementation(() => mockSavedCandidate);

      // Act
      const result = await addCandidate(candidateData);

      // Assert
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(mockSavedCandidate.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should handle duplicate email error', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        save: jest.fn().mockRejectedValue({
          code: 'P2002',
          message: 'Unique constraint failed on the fields: (`email`)'
        })
      };

      (Candidate as unknown as jest.Mock).mockImplementation(() => mockSavedCandidate);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });

    it('should handle database connection error', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      const mockSavedCandidate = {
        id: 1,
        ...candidateData,
        save: jest.fn().mockRejectedValue(new Error('Database connection error'))
      };

      (Candidate as unknown as jest.Mock).mockImplementation(() => mockSavedCandidate);

      // Act & Assert
      await expect(addCandidate(candidateData)).rejects.toThrow('Database connection error');
    });
  });
}); 