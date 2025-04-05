import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { validateCandidateData } from '../application/validator';

jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator');

describe('addCandidate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Candidate.prototype.save as jest.Mock).mockResolvedValue({ id: 1 }); // Mock con id
        (validateCandidateData as jest.Mock).mockImplementation(() => {}); // Mock sin errores por defecto
    });

    describe('Data Validation', () => {
        it('should validate candidate data', async () => {
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
            await addCandidate(candidateData);
            expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
        });

        it('should throw an error if validation fails', async () => {
            (validateCandidateData as jest.Mock).mockImplementation(() => {
                throw new Error('Validation error');
            });
            const candidateData = { firstName: '', lastName: '', email: 'invalid-email' };
            await expect(addCandidate(candidateData)).rejects.toThrow('Validation error');
        });
    });

    describe('Database Saving', () => {
        it('should save a candidate with basic details', async () => {
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate); // Mock con id y datos

            const result = await addCandidate(candidateData);

            expect(Candidate.prototype.save).toHaveBeenCalled();
            expect(result).toEqual(mockSavedCandidate);
        });

        it('should save education details if provided', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                educations: [{ institution: 'University', title: 'BSc', startDate: '2020-01-01', endDate: '2023-01-01' }],
            };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate);

            await addCandidate(candidateData);

            expect(Education.prototype.save).toHaveBeenCalled();
            expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
        });

        it('should save work experience details if provided', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                workExperiences: [{ company: 'Company', position: 'Developer', startDate: '2020-01-01', endDate: '2023-01-01' }],
            };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate);

            await addCandidate(candidateData);

            expect(WorkExperience.prototype.save).toHaveBeenCalled();
            expect(WorkExperience).toHaveBeenCalledWith(candidateData.workExperiences[0]);
        });

        it('should save CV details if provided', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                cv: { filePath: 'path/to/cv.pdf', fileType: 'application/pdf' },
            };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate);

            await addCandidate(candidateData);

            expect(Resume.prototype.save).toHaveBeenCalled();
            expect(Resume).toHaveBeenCalledWith(candidateData.cv);
        });

        it('should throw an error if email already exists', async () => {
            (Candidate.prototype.save as jest.Mock).mockRejectedValue({ code: 'P2002' });
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'duplicate@example.com' };

            await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
        });

        it('should throw an error for unexpected database errors', async () => {
            (Candidate.prototype.save as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

            await expect(addCandidate(candidateData)).rejects.toThrow('Unexpected error');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty education and work experience arrays gracefully', async () => {
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', educations: [], workExperiences: [] };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate);

            const result = await addCandidate(candidateData);

            expect(result).toEqual(mockSavedCandidate);
            expect(Education.prototype.save).not.toHaveBeenCalled();
            expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
        });

        it('should handle missing optional fields', async () => {
            const candidateData = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
            const mockSavedCandidate = { id: 1, ...candidateData };
            (Candidate.prototype.save as jest.Mock).mockResolvedValue(mockSavedCandidate);

            const result = await addCandidate(candidateData);

            expect(result).toEqual(mockSavedCandidate);
        });
    });
});
