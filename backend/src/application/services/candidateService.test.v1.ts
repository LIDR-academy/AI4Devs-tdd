/*import { addCandidate } from '../src/application/services/candidateService';
import { Candidate } from '../src/domain/models/Candidate';
import { validateCandidateData } from '../src/application/validator';
import { Education } from '../src/domain/models/Education';
import { WorkExperience } from '../src/domain/models/WorkExperience';
import { Resume } from '../src/domain/models/Resume';

jest.mock('../../domain/models/Candidate');
jest.mock('../validator');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');

describe('addCandidate', () => {
    const mockCandidateData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        educations: [{ degree: 'BSc', institution: 'University' }],
        workExperiences: [{ company: 'Company', position: 'Developer' }],
        cv: { fileName: 'resume.pdf', filePath: '/path/to/resume.pdf' }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should add a candidate successfully', async () => {
        const mockSave = jest.fn().mockResolvedValue({ id: '123' });
        (Candidate.prototype.save as jest.Mock).mockImplementation(() => ({ save: mockSave, education: [], workExperience: [], resumes: [] }));
        (Education.prototype.save as jest.Mock).mockImplementation(() => ({ save: jest.fn() }));
        (WorkExperience.prototype.save as jest.Mock).mockImplementation(() => ({ save: jest.fn() }));
        (Resume.prototype.save as jest.Mock).mockImplementation(() => ({ save: jest.fn() }));

        const result = await addCandidate(mockCandidateData);

        expect(validateCandidateData).toHaveBeenCalledWith(mockCandidateData);
        expect(mockSave).toHaveBeenCalled();
        expect(result.id).toBe('123');
    });

    test('should throw validation error', async () => {
        (validateCandidateData as jest.Mock).mockImplementation(() => { throw new Error('Validation error'); });

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Validation error');
    });

    test('should throw unique constraint error', async () => {
        const mockSave = jest.fn().mockRejectedValue({ code: 'P2002' });
        (Candidate.prototype.save as jest.Mock).mockImplementation(() => ({ save: mockSave }));

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('The email already exists in the database');
    });

    test('should throw general database error', async () => {
        const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
        (Candidate.prototype.save as jest.Mock).mockImplementation(() => ({ save: mockSave }));

        await expect(addCandidate(mockCandidateData)).rejects.toThrow('Database error');
    });
});*/