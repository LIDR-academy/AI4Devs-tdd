import { PrismaClient, Prisma } from '@prisma/client';
import { Candidate } from '../models/Candidate';

const prisma = new PrismaClient();

export class CandidateRepository {
    async findById(id: number): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({
            where: { id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true
            }
        });

        if (!data) return null;
        return new Candidate(data);
    }

    async create(candidate: Candidate): Promise<any> {
        try {
            // Prepare candidate data
            const candidateData: any = {
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                email: candidate.email,
            };

            // Add optional fields
            if (candidate.phone) candidateData.phone = candidate.phone;
            if (candidate.address) candidateData.address = candidate.address;

            // Add related records using nested writes
            if (candidate.education.length > 0) {
                candidateData.educations = {
                    create: candidate.education.map(edu => ({
                        institution: edu.institution,
                        title: edu.title,
                        startDate: edu.startDate,
                        endDate: edu.endDate
                    }))
                };
            }

            if (candidate.workExperience.length > 0) {
                candidateData.workExperiences = {
                    create: candidate.workExperience.map(exp => ({
                        company: exp.company,
                        position: exp.position,
                        description: exp.description,
                        startDate: exp.startDate,
                        endDate: exp.endDate
                    }))
                };
            }

            if (candidate.resumes.length > 0) {
                candidateData.resumes = {
                    create: candidate.resumes.map(resume => ({
                        filePath: resume.filePath,
                        fileType: resume.fileType,
                        uploadDate: resume.uploadDate || new Date()
                    }))
                };
            }

            // Create the candidate with all nested relations in a single transaction
            const result = await prisma.candidate.create({
                data: candidateData,
                include: {
                    educations: true,
                    workExperiences: true,
                    resumes: true
                }
            });

            return result;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientInitializationError) {
                throw new Error('Database connection failed. Please make sure the database server is running.');
            } else if (error.code === 'P2002') {
                throw new Error('The email already exists in the database');
            } else {
                throw error;
            }
        }
    }

    async update(candidate: Candidate): Promise<any> {
        if (!candidate.id) {
            throw new Error('Cannot update a candidate without an ID');
        }

        try {
            // Prepare candidate data
            const candidateData: any = {};

            // Only include fields that are defined
            if (candidate.firstName !== undefined) candidateData.firstName = candidate.firstName;
            if (candidate.lastName !== undefined) candidateData.lastName = candidate.lastName;
            if (candidate.email !== undefined) candidateData.email = candidate.email;
            if (candidate.phone !== undefined) candidateData.phone = candidate.phone;
            if (candidate.address !== undefined) candidateData.address = candidate.address;

            // Update the candidate
            const result = await prisma.candidate.update({
                where: { id: candidate.id },
                data: candidateData,
                include: {
                    educations: true,
                    workExperiences: true,
                    resumes: true
                }
            });

            return result;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientInitializationError) {
                throw new Error('Database connection failed. Please make sure the database server is running.');
            } else if (error.code === 'P2025') {
                throw new Error('Candidate with the provided ID not found');
            } else {
                throw error;
            }
        }
    }
}
