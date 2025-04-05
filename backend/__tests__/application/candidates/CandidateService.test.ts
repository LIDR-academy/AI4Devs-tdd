import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addCandidate } from '../../../src/application/services/candidateService';
import { Candidate } from '../../../src/domain/models/Candidate';
import { Education } from '../../../src/domain/models/Education';
import { WorkExperience } from '../../../src/domain/models/WorkExperience';
import { Resume } from '../../../src/domain/models/Resume';

// Mock the models
vi.mock('../../../src/domain/models/Candidate', () => {
    const mockSave = vi.fn();
    return {
        Candidate: vi.fn().mockImplementation((data) => ({
            ...data,
            save: mockSave,
            education: [],
            workExperience: [],
            resumes: []
        }))
    };
});

vi.mock('../../../src/domain/models/Education', () => ({
    Education: vi.fn().mockImplementation((data) => ({
        ...data,
        save: vi.fn().mockResolvedValue({ id: 1, ...data })
    }))
}));

vi.mock('../../../src/domain/models/WorkExperience', () => ({
    WorkExperience: vi.fn().mockImplementation((data) => ({
        ...data,
        save: vi.fn().mockResolvedValue({ id: 1, ...data })
    }))
}));

vi.mock('../../../src/domain/models/Resume', () => ({
    Resume: vi.fn().mockImplementation((data) => ({
        ...data,
        save: vi.fn().mockResolvedValue({ id: 1, ...data })
    }))
}));

describe('Candidate Service', () => {
    let validCandidateData: any;
    let mockSave: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        validCandidateData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "656874937",
            address: "Test Address",
            educations: [{
                institution: "Test University",
                title: "Computer Science",
                startDate: "2020-01-01",
                endDate: "2024-01-01"
            }],
            workExperiences: [{
                company: "Test Company",
                position: "Developer",
                description: "Test description",
                startDate: "2024-01-01",
                endDate: "2024-03-01"
            }]
        };

        // Get the mock save function from the first instance
        const mockCandidate = new Candidate(validCandidateData);
        mockSave = mockCandidate.save;
    });

    describe('addCandidate', () => {
        it('should create a candidate successfully', async () => {
            mockSave.mockResolvedValueOnce({ id: 1, ...validCandidateData });
            
            const result = await addCandidate(validCandidateData);
            
            expect(result).toEqual(expect.objectContaining({
                id: 1,
                firstName: validCandidateData.firstName,
                lastName: validCandidateData.lastName,
                email: validCandidateData.email
            }));
            expect(Candidate).toHaveBeenCalledWith(validCandidateData);
        });

        it('should throw error when email already exists', async () => {
            mockSave.mockRejectedValueOnce({
                code: 'P2002',
                meta: { target: ['email'] }
            });

            await expect(addCandidate(validCandidateData))
                .rejects
                .toThrow('The email already exists in the database');
        });

        it('should create candidate with associated education records', async () => {
            mockSave.mockResolvedValueOnce({ id: 1, ...validCandidateData });
            
            await addCandidate(validCandidateData);

            expect(Education).toHaveBeenCalledWith(expect.objectContaining({
                institution: validCandidateData.educations[0].institution,
                title: validCandidateData.educations[0].title
            }));
        });

        it('should create candidate with associated work experience records', async () => {
            mockSave.mockResolvedValueOnce({ id: 1, ...validCandidateData });
            
            await addCandidate(validCandidateData);

            expect(WorkExperience).toHaveBeenCalledWith(expect.objectContaining({
                company: validCandidateData.workExperiences[0].company,
                position: validCandidateData.workExperiences[0].position
            }));
        });

        it('should handle database connection errors', async () => {
            mockSave.mockRejectedValueOnce(new Error('Database connection error'));

            await expect(addCandidate(validCandidateData))
                .rejects
                .toThrow('Database connection error');
        });
    });
});
