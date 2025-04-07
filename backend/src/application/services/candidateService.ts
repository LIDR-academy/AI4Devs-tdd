import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { CandidateRepository } from '../../domain/repositories/candidateRepository';

const candidateRepository = new CandidateRepository();

export const addCandidate = async (candidateData: any) => {
    try {
        // Validate the candidate data
        validateCandidateData(candidateData);

        // Create a new Candidate domain entity with all its related entities
        const candidate = new Candidate({
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email,
            phone: candidateData.phone,
            address: candidateData.address,
            // Convert related entities
            educations: candidateData.educations || [],
            workExperiences: candidateData.workExperiences || [],
            resumes: candidateData.cv ? [candidateData.cv] : []
        });

        // Use the repository to persist the candidate with all its relationships
        const result = await candidateRepository.create(candidate);
        return result;
    } catch (error: any) {
        throw error;
    }
};

export const findCandidateById = async (id: number) => {
    return await candidateRepository.findById(id);
};

export const updateCandidate = async (id: number, candidateData: any) => {
    try {
        // Find the existing candidate
        const existingCandidate = await candidateRepository.findById(id);
        if (!existingCandidate) {
            throw new Error('Candidate not found');
        }

        // Update the candidate properties
        if (candidateData.firstName) existingCandidate.firstName = candidateData.firstName;
        if (candidateData.lastName) existingCandidate.lastName = candidateData.lastName;
        if (candidateData.email) existingCandidate.email = candidateData.email;
        if (candidateData.phone) existingCandidate.phone = candidateData.phone;
        if (candidateData.address) existingCandidate.address = candidateData.address;

        // Use the repository to update the candidate
        const result = await candidateRepository.update(existingCandidate);
        return result;
    } catch (error: any) {
        throw error;
    }
};