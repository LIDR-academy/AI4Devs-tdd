import { Request, Response } from 'express';
import { addCandidateController } from '../../../presentation/controllers/candidateController';
import { addCandidate } from '../../../application/services/candidateService';

// Mock the candidate service
jest.mock('../../../application/services/candidateService');

describe('Candidate Controller', () => {
  const mockRequestData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    address: 'Test Address',
    educations: [
      {
        institution: 'University A',
        title: 'Computer Science',
        startDate: '2015-01-01',
        endDate: '2019-01-01'
      }
    ],
    workExperiences: [
      {
        company: 'Tech Corp',
        position: 'Developer',
        startDate: '2019-02-01',
        endDate: '2022-01-01',
        description: 'Worked as a developer'
      }
    ],
    cv: {
      filePath: '/uploads/resume.pdf',
      fileType: 'application/pdf'
    }
  };

  const mockResponseData = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    address: 'Test Address',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: mockRequestData
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addCandidateController', () => {
    test('should create a new candidate successfully', async () => {
      // Arrange
      (addCandidate as jest.Mock).mockResolvedValue(mockResponseData);

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(addCandidate).toHaveBeenCalledWith(mockRequestData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: mockResponseData
      });
    });

    test('should handle validation errors', async () => {
      // Arrange
      const validationError = new Error('Invalid email format');
      (addCandidate as jest.Mock).mockRejectedValue(validationError);

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        error: validationError.message
      });
    });

    test('should handle unexpected errors', async () => {
      // Arrange
      const unexpectedError = new Error('Database connection failed');
      (addCandidate as jest.Mock).mockRejectedValue(unexpectedError);

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400); // or 500 depending on your implementation
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        error: expect.any(String)
      }));
    });

    // Test for updating candidate with ID
    test('should handle updating existing candidate', async () => {
      // Arrange
      const updateRequestData = {
        ...mockRequestData,
        id: 1,
        firstName: 'John Updated'
      };
      
      mockRequest.body = updateRequestData;
      
      const updatedResponse = {
        ...mockResponseData,
        firstName: 'John Updated'
      };
      
      (addCandidate as jest.Mock).mockResolvedValue(updatedResponse);

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(addCandidate).toHaveBeenCalledWith(updateRequestData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(String),
        data: updatedResponse
      });
    });

    // Test for error when updating non-existent candidate
    test('should handle error when updating non-existent candidate', async () => {
      // Arrange
      const updateRequestData = {
        ...mockRequestData,
        id: 999 // Non-existent ID
      };
      
      mockRequest.body = updateRequestData;
      
      const notFoundError = new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
      (addCandidate as jest.Mock).mockRejectedValue(notFoundError);

      // Act
      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        error: notFoundError.message
      }));
    });
  });
});
