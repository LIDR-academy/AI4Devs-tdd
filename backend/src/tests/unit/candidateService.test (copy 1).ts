// @ts-nocheck
import { jest } from '@jest/globals';
import { addCandidate } from '../../application/services/candidateService';
import { validateCandidateData } from '../../application/validator';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

// Mock de los módulos
jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');
jest.mock('../../application/validator');

describe('Candidate Service Tests', () => {
    const mockValidateData = validateCandidateData as jest.MockedFunction<typeof validateCandidateData>;
    
    const validCandidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        educations: [
            {
                institution: 'University',
                title: 'Computer Science',
                startDate: '2018-01-01',
                endDate: '2022-01-01'
            }
        ],
        workExperiences: [
            {
                company: 'Tech Corp',
                position: 'Developer',
                startDate: '2022-02-01',
                endDate: '2023-12-31'
            }
        ],
        cv: {
            filePath: '/path/to/cv.pdf',
            fileType: 'pdf'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockValidateData.mockImplementation(() => true);

        // Mock Candidate
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockResolvedValue({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '1234567890',
                address: '123 Main St'
            })
        }));

        // Mock Education
        (Education as jest.MockedClass<typeof Education>).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                id: 1,
                institution: 'University',
                title: 'Computer Science',
                startDate: new Date('2018-01-01'),
                endDate: new Date('2022-01-01'),
                candidateId: 1
            })
        }));

        // Mock WorkExperience
        (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                id: 1,
                company: 'Tech Corp',
                position: 'Developer',
                startDate: new Date('2022-02-01'),
                endDate: new Date('2023-12-31'),
                candidateId: 1
            })
        }));

        // Mock Resume
        (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({
                id: 1,
                filePath: '/path/to/cv.pdf',
                fileType: 'pdf',
                candidateId: 1,
                uploadDate: new Date()
            })
        }));
    });

    it('should create a candidate with all related data', async () => {
        const result = await addCandidate(validCandidateData);

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(validateCandidateData).toHaveBeenCalledWith(validCandidateData);
    });

    it('should create a candidate without optional data', async () => {
        const minimalData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        };

        const result = await addCandidate(minimalData);

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
    });

    it('should throw error when validation fails', async () => {
        const invalidData = {
            firstName: 'John'
            // Faltan campos requeridos
        };

        mockValidateData.mockImplementation(() => {
            throw new Error('Invalid candidate data');
        });

        await expect(addCandidate(invalidData)).rejects.toThrow('Invalid candidate data');
    });

    it('should handle duplicate email error', async () => {
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint failed on the fields: (`email`)'
            })
        }));

        await expect(addCandidate(validCandidateData))
            .rejects.toThrow('The email already exists in the database');
    });

    it('should handle database error', async () => {
        (Candidate as jest.MockedClass<typeof Candidate>).mockImplementation(() => ({
            education: [],
            workExperience: [],
            resumes: [],
            save: jest.fn().mockRejectedValue(new Error('Database connection error'))
        }));

        await expect(addCandidate(validCandidateData))
            .rejects.toThrow('Database connection error');
    });

    it('should handle error when saving education', async () => {
        (Education as jest.MockedClass<typeof Education>).mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Error saving education'))
        }));

        await expect(addCandidate(validCandidateData))
            .rejects.toThrow('Error saving education');
    });

    it('should handle error when saving work experience', async () => {
        (WorkExperience as jest.MockedClass<typeof WorkExperience>).mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Error saving work experience'))
        }));

        await expect(addCandidate(validCandidateData))
            .rejects.toThrow('Error saving work experience');
    });

    it('should handle error when saving resume', async () => {
        (Resume as jest.MockedClass<typeof Resume>).mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Error saving resume'))
        }));

        await expect(addCandidate(validCandidateData))
            .rejects.toThrow('Error saving resume');
    });
}); 