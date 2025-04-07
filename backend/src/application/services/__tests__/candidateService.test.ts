import { addCandidate } from '../candidateService';
import prisma from '../../../__tests__/prisma';

describe('Candidate Service', () => {
    describe('addCandidate', () => {
        it('should create a new candidate with basic information', async () => {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '612345678',
                address: '123 Main St'
            };

            const result = await addCandidate(candidateData);

            expect(result).toHaveProperty('id');
            expect(result.firstName).toBe(candidateData.firstName);
            expect(result.lastName).toBe(candidateData.lastName);
            expect(result.email).toBe(candidateData.email);
            expect(result.phone).toBe(candidateData.phone);
            expect(result.address).toBe(candidateData.address);
        });

        it('should create a candidate with education history', async () => {
            const candidateData = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                educations: [
                    {
                        institution: 'University of Test',
                        title: 'Bachelor of Science',
                        startDate: '2015-09-01',
                        endDate: '2019-06-01'
                    }
                ]
            };

            const result = await addCandidate(candidateData);

            const education = await prisma.education.findFirst({
                where: { candidateId: result.id }
            });

            expect(education).not.toBeNull();
            expect(education?.institution).toBe('University of Test');
        });

        it('should create a candidate with work experience', async () => {
            const candidateData = {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob.johnson@example.com',
                workExperiences: [
                    {
                        company: 'Test Corp',
                        position: 'Software Engineer',
                        description: 'Worked on testing',
                        startDate: '2020-01-01',
                        endDate: '2022-12-31'
                    }
                ]
            };

            const result = await addCandidate(candidateData);

            const workExperience = await prisma.workExperience.findFirst({
                where: { candidateId: result.id }
            });

            expect(workExperience).not.toBeNull();
            expect(workExperience?.company).toBe('Test Corp');
        });

        it('should not allow duplicate email addresses', async () => {
            const candidateData = {
                firstName: 'Alice',
                lastName: 'Brown',
                email: 'alice.brown@example.com'
            };

            // First creation should succeed
            await addCandidate(candidateData);

            // Second creation with same email should fail
            await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
        });
    });
});