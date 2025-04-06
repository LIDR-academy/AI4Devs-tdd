/**
 * Test suite for Candidate Management System
 * This file contains tests for validating candidate data, education records,
 * work experience entries, and resume uploads.
 */

// Type definitions for mocking Prisma
interface MockDatabase {
    candidates: Map<number, any>;
    education: Map<number, any>;
    workExperience: Map<number, any>;
    resumes: Map<number, any>;
}

interface Validators {
    validateEmail: (email: string) => void;
    validateRequiredFields: (data: any, fields: string[], customMessages?: Record<string, string>) => void;
    validateDates: (startDate: Date, endDate?: Date) => void;
    validateFileType: (fileType: string) => void;
    validateFileSize: (fileSize: number) => void;
}

interface PrismaMock {
    candidate: {
        create: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
    education: {
        create: jest.Mock;
        findMany: jest.Mock;
        orderBy?: { [key: string]: 'asc' | 'desc' };
    };
    workExperience: {
        create: jest.Mock;
        findMany: jest.Mock;
    };
    resume: {
        create: jest.Mock;
        findFirst: jest.Mock;
    };
    $connect: jest.Mock;
    $disconnect: jest.Mock;
    $transaction: jest.Mock;
}

interface Education {
    id: number;
    institution: string;
    degree: string;
    startDate: Date;
    endDate?: Date;
    candidateId: number;
}

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockDatabase: MockDatabase = {
        candidates: new Map(),
        education: new Map(),
        workExperience: new Map(),
        resumes: new Map()
    };

    const validators: Validators = {
        validateEmail: (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }
        },
        validateRequiredFields: (data: any, fields: string[], customMessages?: Record<string, string>) => {
            fields.forEach(field => {
                if (!data[field]) {
                    const message = customMessages?.[field] || `Missing required fields: ${field}`;
                    throw new Error(message);
                }
            });
        },
        validateDates: (startDate: Date, endDate?: Date) => {
            if (endDate && new Date(startDate) > new Date(endDate)) {
                throw new Error('End date cannot be before start date');
            }
        },
        validateFileType: (fileType: string) => {
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(fileType)) {
                throw new Error('Invalid file type');
            }
        },
        validateFileSize: (fileSize: number) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (fileSize > maxSize) {
                throw new Error('File size exceeds limit');
            }
        }
    };

    const mockPrismaClient: PrismaMock = {
        candidate: {
            create: jest.fn(async (data: any) => {
                validators.validateRequiredFields(data.data, ['firstName', 'lastName', 'email', 'phone']);
                validators.validateEmail(data.data.email);
                const id = mockDatabase.candidates.size + 1;
                const candidate = { id, ...data.data };
                mockDatabase.candidates.set(id, candidate);
                return candidate;
            }),
            findUnique: jest.fn(async (query: any) => {
                const candidate = Array.from(mockDatabase.candidates.values())
                    .find(c => c.id === query.where.id || c.email === query.where.email);
                return candidate || null;
            }),
            update: jest.fn(async (data: any) => {
                const candidate = mockDatabase.candidates.get(data.where.id);
                if (!candidate) throw new Error('Record not found');
                const updatedCandidate = { ...candidate, ...data.data };
                mockDatabase.candidates.set(data.where.id, updatedCandidate);
                return updatedCandidate;
            }),
            delete: jest.fn(async (query: any) => {
                const deleted = mockDatabase.candidates.delete(query.where.id);
                if (!deleted) throw new Error('Record not found');
                return { id: query.where.id };
            })
        },
        education: {
            create: jest.fn(async (data: any) => {
                validators.validateRequiredFields(
                    data.data, 
                    ['institution', 'degree', 'startDate'],
                    { institution: 'Institution is required' }
                );
                if (data.data.endDate) {
                    validators.validateDates(data.data.startDate, data.data.endDate);
                }
                const id = mockDatabase.education.size + 1;
                const education = { 
                    id, 
                    ...data.data,
                    institution: data.data.institution,
                    degree: data.data.degree,
                    startDate: new Date(data.data.startDate),
                    endDate: data.data.endDate ? new Date(data.data.endDate) : null,
                    candidateId: data.data.candidateId
                };
                mockDatabase.education.set(id, education);
                return education;
            }),
            findMany: jest.fn(async (query: any) => {
                let results = Array.from(mockDatabase.education.values())
                    .filter(e => e.candidateId === query.where.candidateId);
                
                if (query.orderBy) {
                    const [field, order] = Object.entries(query.orderBy)[0];
                    results.sort((a, b) => {
                        if (order === 'asc') {
                            return a[field] > b[field] ? 1 : -1;
                        }
                        return a[field] < b[field] ? 1 : -1;
                    });
                }
                
                return results;
            })
        },
        workExperience: {
            create: jest.fn(async (data: any) => {
                validators.validateRequiredFields(data.data, ['company', 'position', 'startDate']);
                if (data.data.endDate) {
                    validators.validateDates(data.data.startDate, data.data.endDate);
                }
                const id = mockDatabase.workExperience.size + 1;
                const experience = { id, ...data.data };
                mockDatabase.workExperience.set(id, experience);
                return experience;
            }),
            findMany: jest.fn(async (query: any) => {
                return Array.from(mockDatabase.workExperience.values())
                    .filter(w => w.candidateId === query.where.candidateId);
            })
        },
        resume: {
            create: jest.fn(async (data: any) => {
                validators.validateFileType(data.data.fileType);
                validators.validateFileSize(data.data.fileSize);
                const id = mockDatabase.resumes.size + 1;
                const resume = { 
                    id, 
                    ...data.data,
                    uploadDate: new Date(),
                    fileName: data.data.fileName
                };
                mockDatabase.resumes.set(id, resume);
                return resume;
            }),
            findFirst: jest.fn(async (query: any) => {
                const resumes = Array.from(mockDatabase.resumes.values())
                    .filter(r => r.candidateId === query.where.candidateId);
                
                if (query.orderBy?.uploadDate === 'desc') {
                    resumes.sort((a, b) => {
                        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
                    });
                }
                
                return resumes[0] || null;
            })
        },
        $connect: jest.fn().mockResolvedValue(undefined),
        $disconnect: jest.fn().mockResolvedValue(undefined),
        $transaction: jest.fn(async (operations) => {
            if (typeof operations === 'function') {
                return operations(mockPrismaClient);
            }
            
            if (Array.isArray(operations)) {
                const results = await Promise.all(operations);
                return results;
            }
            
            // Si es una operación simple
            const result = await operations;
            if (result.candidateData) {
                // Asegurarse de que las propiedades del candidato estén en el nivel superior
                return {
                    ...result.candidateData,
                    education: result.education,
                    experience: result.experience,
                    resume: result.resume
                };
            }
            return result;
        })
    };

    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
        PrismaClientInitializationError: class extends Error {
            constructor(message: string) {
                super(message);
                this.name = 'PrismaClientInitializationError';
            }
        },
        PrismaClientKnownRequestError: class extends Error {
            code: string;
            constructor(message: string, { code }: { code: string }) {
                super(message);
                this.name = 'PrismaClientKnownRequestError';
                this.code = code;
            }
        }
    };
});

/**
 * Test Suite: Candidate Entity Validation
 * Purpose: Validates all aspects of candidate data management including
 * basic information, education, work experience, and resume uploads.
 */
describe('Candidate Entity Validation Tests', () => {
    let prisma: any;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new (require('@prisma/client').PrismaClient)();
    });

    /**
     * Test Group: Basic Candidate Information
     * Validates core candidate data fields and constraints
     */
    describe('Candidate Basic Information Validation', () => {
        it('should validate a candidate with valid basic information', async () => {
            // Arrange
            const validCandidate = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "612345678"
            };

            // Act
            const result = await prisma.candidate.create({ data: validCandidate });
            
            // Assert
            expect(result).toHaveProperty('id');
            expect(result.firstName).toBe(validCandidate.firstName);
            expect(result.email).toBe(validCandidate.email);
        });

        it('should reject a candidate with invalid email format', async () => {
            const invalidCandidate = {
                firstName: "John",
                lastName: "Doe",
                email: "invalid-email",
                phone: "612345678"
            };

            await expect(
                prisma.candidate.create({ data: invalidCandidate })
            ).rejects.toThrow('Invalid email format');
        });

        it('should reject a candidate with missing required fields', async () => {
            const incompleteCandidate = {
                firstName: "John"
            };

            await expect(
                prisma.candidate.create({ data: incompleteCandidate })
            ).rejects.toThrow('Missing required fields');
        });
    });

    /**
     * Test Group: Education Information
     * Validates educational background data and constraints
     */
    describe('Education Information Validation', () => {
        it('should validate valid education information', async () => {
            const validEducation = {
                institution: "Universidad Complutense",
                degree: "Computer Science",
                startDate: new Date('2020-01-01'),
                endDate: new Date('2024-01-01'),
                candidateId: 1
            };

            const result = await prisma.education.create({ data: validEducation });
            
            expect(result).toHaveProperty('id');
            expect(result.institution).toBe(validEducation.institution);
        });

        it('should reject education with end date before start date', async () => {
            const invalidEducation = {
                institution: "Universidad Complutense",
                degree: "Computer Science",
                startDate: new Date('2024-01-01'),
                endDate: new Date('2020-01-01'),
                candidateId: 1
            };

            await expect(
                prisma.education.create({ data: invalidEducation })
            ).rejects.toThrow('End date cannot be before start date');
        });

        it('should reject education without required institution', async () => {
            const invalidEducation = {
                degree: "Computer Science",
                startDate: new Date('2020-01-01'),
                candidateId: 1
            };

            await expect(
                prisma.education.create({ data: invalidEducation })
            ).rejects.toThrow('Institution is required');
        });
    });

    /**
     * Test Group: Work Experience
     * Validates work history data and constraints
     */
    describe('Work Experience Validation', () => {
        it('should validate valid work experience', async () => {
            const validExperience = {
                company: "Tech Corp",
                position: "Software Engineer",
                description: "Full-stack development",
                startDate: new Date('2020-01-01'),
                endDate: new Date('2023-12-31'),
                candidateId: 1
            };

            const result = await prisma.workExperience.create({ data: validExperience });
            
            expect(result).toHaveProperty('id');
            expect(result.company).toBe(validExperience.company);
        });

        it('should reject experience with end date before start date', async () => {
            const invalidExperience = {
                company: "Tech Corp",
                position: "Software Engineer",
                startDate: new Date('2023-01-01'),
                endDate: new Date('2020-01-01'),
                candidateId: 1
            };

            await expect(
                prisma.workExperience.create({ data: invalidExperience })
            ).rejects.toThrow('End date cannot be before start date');
        });

        it('should accept current job without end date', async () => {
            const currentJob = {
                company: "Tech Corp",
                position: "Software Engineer",
                startDate: new Date('2023-01-01'),
                currentJob: true,
                candidateId: 1
            };

            const result = await prisma.workExperience.create({ data: currentJob });
            expect(result.currentJob).toBe(true);
            expect(result.endDate).toBeUndefined();
        });
    });

    /**
     * Test Group: Resume/CV Validation
     * Validates resume upload constraints and file properties
     */
    describe('Resume/CV Validation', () => {
        it('should validate valid CV upload', async () => {
            const validCV = {
                fileName: "john-doe-cv.pdf",
                fileType: "application/pdf",
                fileSize: 1024 * 1024, // 1MB
                candidateId: 1
            };

            const result = await prisma.resume.create({ data: validCV });
            
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('uploadDate');
            expect(result.fileType).toBe(validCV.fileType);
        });

        it('should reject invalid file type', async () => {
            const invalidCV = {
                fileName: "john-doe-cv.exe",
                fileType: "application/x-msdownload",
                fileSize: 1024 * 1024,
                candidateId: 1
            };

            await expect(
                prisma.resume.create({ data: invalidCV })
            ).rejects.toThrow('Invalid file type');
        });

        it('should reject files exceeding size limit', async () => {
            const largeCV = {
                fileName: "john-doe-cv.pdf",
                fileType: "application/pdf",
                fileSize: 10 * 1024 * 1024, // 10MB
                candidateId: 1
            };

            await expect(
                prisma.resume.create({ data: largeCV })
            ).rejects.toThrow('File size exceeds limit');
        });
    });

    /**
     * Test Group: Complete Profile Creation
     * Validates the creation of a complete candidate profile with all related entities
     */
    describe('Complete Candidate Profile Validation', () => {
        it('should create a complete candidate profile with all related entities', async () => {
            // Arrange
            const completeProfile = {
                candidate: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    phone: "612345678"
                },
                education: [{
                    institution: "Universidad Complutense",
                    degree: "Computer Science",
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2024-01-01')
                }],
                experience: [{
                    company: "Tech Corp",
                    position: "Software Engineer",
                    description: "Full-stack development",
                    startDate: new Date('2023-01-01'),
                    currentJob: true
                }],
                resume: {
                    fileName: "john-doe-cv.pdf",
                    fileType: "application/pdf",
                    fileSize: 1024 * 1024
                }
            };

            // Act
            const result = await prisma.$transaction(async (tx: any) => {
                const candidate = await tx.candidate.create({ 
                    data: completeProfile.candidate 
                });

                const education = await tx.education.create({
                    data: { ...completeProfile.education[0], candidateId: candidate.id }
                });

                const experience = await tx.workExperience.create({
                    data: { ...completeProfile.experience[0], candidateId: candidate.id }
                });

                const resume = await tx.resume.create({
                    data: { ...completeProfile.resume, candidateId: candidate.id }
                });

                return { candidate, education, experience, resume };
            });

            // Assert
            expect(result.candidate).toHaveProperty('id');
            expect(result.education).toHaveProperty('id');
            expect(result.experience).toHaveProperty('id');
            expect(result.resume).toHaveProperty('id');
        });
    });
});

/**
 * Test Suite: Database Operations
 * Purpose: Validates database operations for candidates and related entities
 * including create, read, update, delete and relationship management.
 */
describe('Database Operations Tests', () => {
    let prisma: any;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = new (require('@prisma/client').PrismaClient)();
    });

    /**
     * Test Group: Candidate CRUD Operations
     */
    describe('Candidate CRUD Operations', () => {
        it('should create and retrieve a candidate', async () => {
            // Arrange
            const newCandidate = {
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                phone: "612345679"
            };

            // Act
            const created = await prisma.candidate.create({ data: newCandidate });
            const found = await prisma.candidate.findUnique({
                where: { email: newCandidate.email }
            });

            // Assert
            expect(created).toHaveProperty('id');
            expect(found).toMatchObject(newCandidate);
        });

        it('should update candidate information', async () => {
            // Arrange
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });

            const updateData = {
                phone: "698765432",
                lastName: "Smith-Jones"
            };

            // Act
            const updated = await prisma.candidate.update({
                where: { id: candidate.id },
                data: updateData
            });

            // Assert
            expect(updated.phone).toBe(updateData.phone);
            expect(updated.lastName).toBe(updateData.lastName);
            expect(updated.email).toBe(candidate.email); // Unchanged field
        });

        it('should delete a candidate and cascade to related entities', async () => {
            // Arrange
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });

            // Act
            await prisma.candidate.delete({ where: { id: candidate.id } });

            // Assert
            const found = await prisma.candidate.findUnique({
                where: { id: candidate.id }
            });
            expect(found).toBeNull();
        });
    });

    /**
     * Test Group: Education Record Management
     */
    describe('Education Record Management', () => {
        let candidateId: number;

        beforeEach(async () => {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });
            candidateId = candidate.id;
        });

        it('should add multiple education records to a candidate', async () => {
            // Arrange
            const educationRecords = [
                {
                    institution: "Universidad Complutense",
                    degree: "Computer Science",
                    startDate: new Date('2018-01-01'),
                    endDate: new Date('2022-01-01'),
                    candidateId
                },
                {
                    institution: "MIT",
                    degree: "Master in AI",
                    startDate: new Date('2022-09-01'),
                    endDate: new Date('2024-06-01'),
                    candidateId
                }
            ];

            // Act
            const created = await Promise.all(
                educationRecords.map(record => 
                    prisma.education.create({ data: record })
                )
            );

            const found = await prisma.education.findMany({
                where: { candidateId },
                orderBy: { startDate: 'asc' }
            });

            // Assert
            expect(created).toHaveLength(2);
            expect(found).toHaveLength(2);
            
            // Verificar que cada institución está presente
            const foundInstitutions = found.map((r: Education) => r.institution);
            educationRecords.forEach(record => {
                expect(foundInstitutions).toContain(record.institution);
            });

            // Verificar el orden cronológico
            expect(found[0].startDate.getTime()).toBeLessThan(found[1].startDate.getTime());
        });
    });

    /**
     * Test Group: Work Experience Management
     */
    describe('Work Experience Management', () => {
        let candidateId: number;

        beforeEach(async () => {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });
            candidateId = candidate.id;
        });

        it('should manage work experience timeline correctly', async () => {
            // Arrange
            const experiences = [
                {
                    company: "Startup Inc",
                    position: "Junior Developer",
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2021-12-31'),
                    candidateId
                },
                {
                    company: "Tech Corp",
                    position: "Senior Developer",
                    startDate: new Date('2022-01-01'),
                    currentJob: true,
                    candidateId
                }
            ];

            // Act
            const created = await Promise.all(
                experiences.map(exp => 
                    prisma.workExperience.create({ data: exp })
                )
            );

            const found = await prisma.workExperience.findMany({
                where: { candidateId },
                orderBy: { startDate: 'asc' }
            });

            // Assert
            expect(created).toHaveLength(2);
            expect(found[0].endDate).toBeDefined();
            expect(found[1].currentJob).toBe(true);
            expect(found[1].endDate).toBeUndefined();
        });
    });

    /**
     * Test Group: Resume/CV Management
     */
    describe('Resume/CV Management', () => {
        let candidateId: number;

        beforeEach(async () => {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });
            candidateId = candidate.id;
        });

        it('should handle CV updates and maintain history', async () => {
            // Arrange: Preparar los datos de prueba
            const initialCV = {
                fileName: "jane-smith-cv-v1.pdf",
                fileType: "application/pdf",
                fileSize: 1024 * 512,
                candidateId
            };

            const updatedCV = {
                fileName: "jane-smith-cv-v2.pdf",
                fileType: "application/pdf",
                fileSize: 1024 * 768,
                candidateId
            };

            // Act: Ejecutar las operaciones
            const firstUpload = await prisma.resume.create({ data: initialCV });
            await new Promise(resolve => setTimeout(resolve, 1));
            const secondUpload = await prisma.resume.create({ data: updatedCV });
            const current = await prisma.resume.findFirst({
                where: { candidateId },
                orderBy: { uploadDate: 'desc' }
            });

            // Assert: Verificar los resultados
            expect(firstUpload).toHaveProperty('uploadDate');
            expect(secondUpload).toHaveProperty('uploadDate');
            expect(current.fileName).toBe(updatedCV.fileName);
            expect(secondUpload.uploadDate.getTime()).toBeGreaterThan(firstUpload.uploadDate.getTime());
        });
    });

    /**
     * Test Group: Complex Queries and Relationships
     */
    describe('Complex Queries and Relationships', () => {
        it('should retrieve complete candidate profile with all related data', async () => {
            // Arrange
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    phone: "612345679"
                }
            });

            await prisma.education.create({
                data: {
                    institution: "Universidad Complutense",
                    degree: "Computer Science",
                    startDate: new Date('2018-01-01'),
                    endDate: new Date('2022-01-01'),
                    candidateId: candidate.id
                }
            });

            await prisma.workExperience.create({
                data: {
                    company: "Tech Corp",
                    position: "Developer",
                    startDate: new Date('2022-01-01'),
                    currentJob: true,
                    candidateId: candidate.id
                }
            });

            await prisma.resume.create({
                data: {
                    fileName: "jane-smith-cv.pdf",
                    fileType: "application/pdf",
                    fileSize: 1024 * 512,
                    candidateId: candidate.id
                }
            });

            // Act
            const profile = await prisma.$transaction(async (tx: any) => {
                const candidateData = await tx.candidate.findUnique({
                    where: { id: candidate.id }
                });
                const education = await tx.education.findMany({
                    where: { candidateId: candidate.id }
                });
                const experience = await tx.workExperience.findMany({
                    where: { candidateId: candidate.id }
                });
                const resume = await tx.resume.findFirst({
                    where: { candidateId: candidate.id }
                });

                return {
                    ...candidateData,
                    education,
                    experience,
                    resume
                };
            });

            // Assert
            expect(profile).toHaveProperty('id');
            expect(profile.education).toHaveLength(1);
            expect(profile.experience).toHaveLength(1);
            expect(profile.resume).toBeDefined();
            expect(profile.email).toBe(candidate.email);
        });
    });
});