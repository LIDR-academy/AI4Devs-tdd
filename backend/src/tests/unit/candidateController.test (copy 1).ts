import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { addCandidateController } from '../../presentation/controllers/candidateController';
import { addCandidate } from '../../application/services/candidateService';
import { Candidate } from '../../domain/models/Candidate';

// Mock del servicio de candidatos
jest.mock('../../application/services/candidateService');

// Mock del modelo Candidate
jest.mock('../../domain/models/Candidate', () => {
    return {
        Candidate: jest.fn().mockImplementation((data: any) => ({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            education: data.education || [],
            workExperience: data.workExperience || [],
            resumes: data.resumes || []
        }))
    };
});

describe('Candidate Controller Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        mockNext = jest.fn();
    });

    it('should add a candidate successfully', async () => {
        const mockCandidateData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            address: '123 Main St'
        };

        const mockSavedCandidate = {
            id: 1,
            ...mockCandidateData,
            education: [],
            workExperience: [],
            resumes: []
        };

        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockResolvedValueOnce(mockSavedCandidate);
        mockReq.body = mockCandidateData;

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockAddCandidate).toHaveBeenCalledWith(mockCandidateData);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Candidate added successfully',
            data: mockSavedCandidate
        });
    });

    it('should handle validation errors', async () => {
        const mockError = new Error('Email is required');
        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockRejectedValueOnce(mockError);

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error adding candidate',
            error: 'Email is required'
        });
    });

    it('should handle unknown errors', async () => {
        const mockError = new Error('Unknown error');
        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockRejectedValueOnce(mockError);

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error adding candidate',
            error: 'Unknown error'
        });
    });

    it('should handle database connection errors', async () => {
        const mockError = new Error('Database connection error');
        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockRejectedValueOnce(mockError);

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error adding candidate',
            error: 'Database connection error'
        });
    });

    it('should handle duplicate email errors', async () => {
        const mockError = new Error('Email already exists');
        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockRejectedValueOnce(mockError);

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error adding candidate',
            error: 'Email already exists'
        });
    });

    it('should handle non-Error type errors', async () => {
        const mockError = 'This is a string error';
        const mockAddCandidate = addCandidate as jest.MockedFunction<typeof addCandidate>;
        mockAddCandidate.mockRejectedValueOnce(mockError);

        await addCandidateController(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error adding candidate',
            error: 'Unknown error'
        });
    });
}); 