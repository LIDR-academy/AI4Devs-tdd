import { Request, Response } from 'express';
import { addCandidateController } from '../candidateController';
import { addCandidate } from '../../../application/services/candidateService';

jest.mock('../../../application/services/candidateService');

describe('CandidateController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  describe('addCandidateController', () => {
    it('should create a candidate and return 201 status with success message', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      const mockCreatedCandidate = {
        id: 1,
        ...candidateData
      };

      req.body = candidateData;
      (addCandidate as jest.Mock).mockResolvedValue(mockCreatedCandidate);

      // Act
      await addCandidateController(req as Request, res as Response);

      // Assert
      expect(addCandidate).toHaveBeenCalledWith(candidateData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    it('should handle validation errors and return 400 status', async () => {
      // Arrange
      const invalidCandidateData = {
        firstName: 'John',
        // Missing lastName
        email: 'invalid-email',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      req.body = invalidCandidateData;
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid data'));

      // Act
      await addCandidateController(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid data'
      });
    });

    it('should handle duplicate email error and return 400 status', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      req.body = candidateData;
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Email already exists'));

      // Act
      await addCandidateController(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Email already exists'
      });
    });

    it('should handle database connection error and return 400 status', async () => {
      // Arrange
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: 'New York, USA'
      };

      req.body = candidateData;
      (addCandidate as jest.Mock).mockRejectedValue(new Error('Database connection error'));

      // Act
      await addCandidateController(req as Request, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Database connection error'
      });
    });
  });
}); 