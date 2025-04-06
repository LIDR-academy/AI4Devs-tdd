import { Request, Response } from 'express';
import { addCandidateController } from '../presentation/controllers/candidateController';
import * as candidateService from '../application/services/candidateService';

// Mock the service
jest.mock('../application/services/candidateService');

describe('Candidate Controller Tests', () => {
  // Setup test environment
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    mockRequest = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('addCandidateController', () => {
    it('should add a candidate and return status 201 with success message', async () => {
      // Arrange
      const mockCandidateResult = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
      };

      (candidateService.addCandidate as jest.Mock).mockResolvedValue(
        mockCandidateResult,
      );

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(
        mockRequest.body,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCandidateResult,
      });
    });

    it('should handle validation errors and return status 400', async () => {
      // Arrange
      const validationError = new Error('Invalid data');
      (candidateService.addCandidate as jest.Mock).mockRejectedValue(
        validationError,
      );

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(
        mockRequest.body,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid data',
      });
    });

    it('should handle unknown errors and return a generic error message', async () => {
      // Arrange
      (candidateService.addCandidate as jest.Mock).mockRejectedValue(
        'Unknown error',
      );

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assert
      expect(candidateService.addCandidate).toHaveBeenCalledWith(
        mockRequest.body,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error',
      });
    });
  });
});
