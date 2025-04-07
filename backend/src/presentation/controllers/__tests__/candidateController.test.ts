import { Request, Response } from 'express';
import { addCandidate } from '../../../application/services/candidateService';
import { candidateController } from '../candidateController';

// Mock the service layer
jest.mock('../../../application/services/candidateService');

describe('Candidate Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockSend: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockSend = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();
        mockResponse = {
            send: mockSend,
            status: mockStatus,
        };
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('addCandidate', () => {
        it('should call service when receiving valid candidate data', async () => {
            // Arrange
            const validCandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            };
            mockRequest = {
                body: validCandidateData
            };
            
            // Mock the service response
            const mockCreatedCandidate = { id: 1, ...validCandidateData };
            (addCandidate as jest.Mock).mockResolvedValue(mockCreatedCandidate);

            // Act
            await candidateController.addCandidate(mockRequest as Request, mockResponse as Response);

            // Assert
            // Verify service was called with correct data
            expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
            // Verify controller sent correct response
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockSend).toHaveBeenCalledWith(mockCreatedCandidate);
        });

        it('should not call service when receiving invalid candidate data', async () => {
            // Arrange
            const invalidCandidateData = {
                firstName: 'John',
                // Missing required email field
            };
            mockRequest = {
                body: invalidCandidateData
            };

            // Mock service to throw error
            (addCandidate as jest.Mock).mockRejectedValue(new Error('Invalid candidate data'));

            // Act
            await candidateController.addCandidate(mockRequest as Request, mockResponse as Response);

            // Assert
            // Verify service was called with invalid data
            expect(addCandidate).toHaveBeenCalledWith(invalidCandidateData);
            // Verify error response
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Invalid candidate data'
            }));
        });
    });
}); 