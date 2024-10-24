import { addCandidate } from './candidateService';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { validateCandidateData } from '../validator';

jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../validator');

describe('addCandidate', () => {
    let candidateSaveMock: jest.SpyInstance;
    let educationSaveMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        candidateSaveMock = jest.spyOn(Candidate.prototype, 'save').mockImplementation();
        educationSaveMock = jest.spyOn(Education.prototype, 'save').mockImplementation();
    });

    it('should add a fully filled candidate successfully', async () => {
        const candidateData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            educations: [
                { degree: 'BSc Computer Science', institution: 'University A' },
                { degree: 'MSc Computer Science', institution: 'University B' }
            ]
        };

        const savedCandidate = { id: '123', ...candidateData };
        candidateSaveMock.mockResolvedValue(savedCandidate);
        educationSaveMock.mockResolvedValue({});

        const result = await addCandidate(candidateData);

        expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
        expect(Candidate).toHaveBeenCalledWith(candidateData);
        expect(Candidate.prototype.save).toHaveBeenCalled();
        expect(result).toEqual(savedCandidate);

        expect(Education).toHaveBeenCalledTimes(2);
        expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
        expect(Education).toHaveBeenCalledWith(candidateData.educations[1]);
        expect(Education.prototype.save).toHaveBeenCalledTimes(2);
    });

    it('should add a partially filled candidate successfully', async () => {
        const candidateData = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com'
        };

        const savedCandidate = { id: '456', ...candidateData };
        candidateSaveMock.mockResolvedValue(savedCandidate);

        const result = await addCandidate(candidateData);

        expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
        expect(Candidate).toHaveBeenCalledWith(candidateData);
        expect(Candidate.prototype.save).toHaveBeenCalled();
        expect(result).toEqual(savedCandidate);

        expect(Education).not.toHaveBeenCalled();
        expect(Education.prototype.save).not.toHaveBeenCalled();
    });

    it('should throw an error if candidate data is invalid', async () => {
        const invalidData = { name: '', email: 'invalid-email' };
        (validateCandidateData as jest.Mock).mockImplementation(() => {
            throw new Error('Validation error');
        });

        await expect(addCandidate(invalidData)).rejects.toThrow('Validation error');
        expect(Candidate).not.toHaveBeenCalled();
        expect(Candidate.prototype.save).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
        const candidateData = {
            name: 'John Doe',
            email: 'john.doe@example.com'
        };

        candidateSaveMock.mockRejectedValue(new Error('Database error'));

        await expect(addCandidate(candidateData)).rejects.toThrow('Database error');
        expect(Candidate).toHaveBeenCalledWith(candidateData);
        expect(Candidate.prototype.save).toHaveBeenCalled();
    });
});