import { describe, it, expect } from 'vitest';
import { validateCandidateData } from '../../../src/application/validator';

describe('Candidate Validation', () => {
    describe('Basic Validation', () => {
        it('should pass with valid data', () => {
            const validData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "656874937",
                address: "Test Address"
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        it('should fail with missing firstName', () => {
            const invalidData = {
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "656874937"
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid name');
        });

        it('should fail with missing lastName', () => {
            const invalidData = {
                firstName: "John",
                email: "john.doe@example.com",
                phone: "656874937"
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid name');
        });

        it('should fail with invalid email format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "invalid-email",
                phone: "656874937"
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid email');
        });

        it('should fail with invalid phone format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "12345"
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid phone');
        });
    });

    describe('Education Validation', () => {
        it('should pass with valid education data', () => {
            const validData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                educations: [{
                    institution: "Test University",
                    title: "Computer Science",
                    startDate: "2020-01-01",
                    endDate: "2024-01-01"
                }]
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        it('should fail with missing institution', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                educations: [{
                    title: "Computer Science",
                    startDate: "2020-01-01",
                    endDate: "2024-01-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid institution');
        });

        it('should fail with missing title', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                educations: [{
                    institution: "Test University",
                    startDate: "2020-01-01",
                    endDate: "2024-01-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid title');
        });

        it('should fail with invalid start date format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                educations: [{
                    institution: "Test University",
                    title: "Computer Science",
                    startDate: "invalid-date",
                    endDate: "2024-01-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid date');
        });

        it('should fail with invalid end date format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                educations: [{
                    institution: "Test University",
                    title: "Computer Science",
                    startDate: "2020-01-01",
                    endDate: "invalid-date"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid end date');
        });
    });

    describe('Work Experience Validation', () => {
        it('should pass with valid work experience data', () => {
            const validData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                workExperiences: [{
                    company: "Test Company",
                    position: "Developer",
                    description: "Test description",
                    startDate: "2024-01-01",
                    endDate: "2024-03-01"
                }]
            };

            expect(() => validateCandidateData(validData)).not.toThrow();
        });

        it('should fail with missing company', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                workExperiences: [{
                    position: "Developer",
                    startDate: "2024-01-01",
                    endDate: "2024-03-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid company');
        });

        it('should fail with missing position', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                workExperiences: [{
                    company: "Test Company",
                    startDate: "2024-01-01",
                    endDate: "2024-03-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid position');
        });

        it('should fail with invalid start date format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                workExperiences: [{
                    company: "Test Company",
                    position: "Developer",
                    startDate: "invalid-date",
                    endDate: "2024-03-01"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid date');
        });

        it('should fail with invalid end date format', () => {
            const invalidData = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                workExperiences: [{
                    company: "Test Company",
                    position: "Developer",
                    startDate: "2024-01-01",
                    endDate: "invalid-date"
                }]
            };

            expect(() => validateCandidateData(invalidData))
                .toThrow('Invalid end date');
        });
    });
});
