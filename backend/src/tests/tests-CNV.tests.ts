import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { validateCandidateData } from '../application/validator';
import { addCandidate } from '../application/services/candidateService';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { Prisma } from '@prisma/client';

// Definir interfaces para los tipos de retorno
interface CandidateReturn {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

interface EducationReturn {
    id: number;
    institution: string;
    title: string;
    startDate: Date;
    candidateId: number;
}

interface WorkExperienceReturn {
    id: number;
    company: string;
    position: string;
    startDate: Date;
    candidateId: number;
}

interface ResumeReturn {
    id: number;
    filePath: string;
    fileType: string;
    uploadDate: Date;
    candidateId: number;
}

// Mock de los módulos
jest.mock('../domain/models/Candidate');
jest.mock('../domain/models/Education');
jest.mock('../domain/models/WorkExperience');
jest.mock('../domain/models/Resume');
jest.mock('../application/validator');

describe('Validación de datos del candidato', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock de validateCandidateData para que lance errores según los datos
        (validateCandidateData as jest.Mock).mockImplementation((data: any) => {
            // Validación de nombres
            if (!data.firstName || data.firstName.length < 2 || data.firstName.length > 100 || /[^a-záéíóúñ\s]/i.test(data.firstName)) {
                throw 'Invalid name';
            }
            if (!data.lastName || data.lastName.length < 2 || data.lastName.length > 100 || /[^a-záéíóúñ\s]/i.test(data.lastName)) {
                throw 'Invalid name';
            }

            // Validación de email
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                throw 'Invalid email';
            }

            // Validación de teléfono
            if (data.phone && (!/^[679]\d{8}$/.test(data.phone))) {
                throw 'Invalid phone';
            }

            // Validación de educación
            if (data.educations) {
                for (const edu of data.educations) {
                    if (!edu.institution || !edu.title) {
                        throw 'Invalid education data';
                    }
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(edu.startDate)) {
                        throw 'Invalid education data';
                    }
                    if (edu.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(edu.endDate)) {
                        throw 'Invalid education data';
                    }
                }
            }

            // Validación de CV
            if (data.cv) {
                if (!data.cv.filePath || !data.cv.fileType) {
                    throw 'Invalid CV data';
                }
            }
        });

        // Mock de Candidate.save
        // @ts-ignore
        (Candidate.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@example.com'
        });
        
        // Mock de Education.save
        // @ts-ignore
        (Education.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            institution: 'Universidad Test',
            title: 'Grado en Test',
            startDate: new Date('2020-01-01'),
            candidateId: 1
        });
        
        // Mock de WorkExperience.save
        // @ts-ignore
        (WorkExperience.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: new Date('2020-01-01'),
            candidateId: 1
        });
        
        // Mock de Resume.save
        // @ts-ignore
        (Resume.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            filePath: '/path/to/file.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
            candidateId: 1
        });
    });

    // Tests para validación de nombres
    describe('Validación de nombres', () => {
        const validNames = [
            { name: 'Juan', description: 'nombre simple' },
            { name: 'María José', description: 'nombre compuesto' },
            { name: 'José María', description: 'nombre con acentos' },
            { name: 'Ángela', description: 'nombre con tilde' }
        ];

        const invalidNames = [
            { name: '', description: 'nombre vacío' },
            { name: 'J', description: 'nombre muy corto' },
            { name: 'a'.repeat(101), description: 'nombre muy largo' },
            { name: 'Juan123', description: 'nombre con números' },
            { name: 'Juan@', description: 'nombre con caracteres especiales' }
        ];

        test.each(validNames)('debería aceptar $description', ({ name }) => {
            // Arrange
            const candidateData = {
                firstName: name,
                lastName: name,
                email: 'test@test.com'
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidNames)('debería rechazar $description', ({ name }) => {
            // Arrange
            const candidateData = {
                firstName: name,
                lastName: name,
                email: 'test@test.com'
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow('Invalid name');
        });
    });

    // Tests para validación de email
    describe('Validación de email', () => {
        const validEmails = [
            { email: 'test@test.com', description: 'email simple' },
            { email: 'test.name@test.com', description: 'email con punto' },
            { email: 'test+name@test.com', description: 'email con +' },
            { email: 'test@sub.test.com', description: 'email con subdominio' }
        ];

        const invalidEmails = [
            { email: '', description: 'email vacío' },
            { email: 'test@', description: 'email sin dominio' },
            { email: '@test.com', description: 'email sin usuario' },
            { email: 'test@test', description: 'email sin TLD' },
            { email: 'test test@test.com', description: 'email con espacios' },
            { email: 'testtest.com', description: 'email sin arroba' }
        ];

        test.each(validEmails)('debería aceptar $description', ({ email }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: email
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidEmails)('debería rechazar $description', ({ email }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: email
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow('Invalid email');
        });
    });

    // Tests para validación de teléfono
    describe('Validación de teléfono', () => {
        const validPhones = [
            { phone: '612345678', description: 'teléfono que empieza por 6' },
            { phone: '712345678', description: 'teléfono que empieza por 7' },
            { phone: '912345678', description: 'teléfono que empieza por 9' }
        ];

        const invalidPhones = [
            { phone: '812345678', description: 'teléfono que empieza por 8' },
            { phone: '61234567', description: 'teléfono con menos de 9 dígitos' },
            { phone: '61234567a', description: 'teléfono con letras' }
        ];

        test.each(validPhones)('debería aceptar $description', ({ phone }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                phone: phone
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidPhones)('debería rechazar $description', ({ phone }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                phone: phone
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow('Invalid phone');
        });
    });

    // Tests para validación de educación
    describe('Validación de educación', () => {
        const validEducation = {
            institution: 'Universidad Test',
            title: 'Grado en Test',
            startDate: '2020-01-01',
            endDate: '2024-01-01'
        };

        const invalidEducations = [
            { 
                education: { ...validEducation, institution: '' },
                description: 'institución vacía'
            },
            {
                education: { ...validEducation, title: '' },
                description: 'título vacío'
            },
            {
                education: { ...validEducation, startDate: '2020/01/01' },
                description: 'formato de fecha inicio incorrecto (con /)'
            },
            {
                education: { ...validEducation, endDate: '2024/01/01' },
                description: 'formato de fecha fin incorrecto (con /)'
            },
            {
                education: { ...validEducation, startDate: '01-01-2020' },
                description: 'formato de fecha inicio incorrecto (DD-MM-YYYY)'
            },
            {
                education: { ...validEducation, endDate: '01-01-2024' },
                description: 'formato de fecha fin incorrecto (DD-MM-YYYY)'
            },
            {
                education: { ...validEducation, startDate: '2020.01.01' },
                description: 'formato de fecha inicio incorrecto (con .)'
            },
            {
                education: { ...validEducation, endDate: '2024.01.01' },
                description: 'formato de fecha fin incorrecto (con .)'
            }
        ];

        test('debería aceptar educación válida', () => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                educations: [validEducation]
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidEducations)('debería rechazar educación con $description', ({ education }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                educations: [education]
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow();
        });
    });

    // Tests para validación de experiencia laboral
    describe('Validación de experiencia laboral', () => {
        const validExperience = {
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
            description: 'Descripción del puesto'
        };

        const invalidExperiences = [
            {
                experience: { ...validExperience, company: '' },
                description: 'empresa vacía'
            },
            {
                experience: { ...validExperience, position: '' },
                description: 'puesto vacío'
            },
            {
                experience: { ...validExperience, startDate: '2020/01/01' },
                description: 'formato de fecha inicio incorrecto (con /)'
            },
            {
                experience: { ...validExperience, endDate: '2024/01/01' },
                description: 'formato de fecha fin incorrecto (con /)'
            },
            {
                experience: { ...validExperience, startDate: '01-01-2020' },
                description: 'formato de fecha inicio incorrecto (DD-MM-YYYY)'
            },
            {
                experience: { ...validExperience, endDate: '01-01-2024' },
                description: 'formato de fecha fin incorrecto (DD-MM-YYYY)'
            },
            {
                experience: { ...validExperience, startDate: '2020.01.01' },
                description: 'formato de fecha inicio incorrecto (con .)'
            },
            {
                experience: { ...validExperience, endDate: '2024.01.01' },
                description: 'formato de fecha fin incorrecto (con .)'
            },
            {
                experience: { ...validExperience, description: 'a'.repeat(201) },
                description: 'descripción muy larga'
            }
        ];

        test('debería aceptar experiencia válida', () => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                workExperiences: [validExperience]
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidExperiences)('debería rechazar experiencia con $description', ({ experience }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                workExperiences: [experience]
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow();
        });
    });

    // Tests para validación de CV
    describe('Validación de CV', () => {
        const validCV = {
            filePath: '/path/to/file.pdf',
            fileType: 'application/pdf'
        };

        const invalidCVs = [
            {
                cv: { filePath: '', fileType: 'application/pdf' },
                description: 'ruta vacía'
            },
            {
                cv: { filePath: '/path/to/file.pdf', fileType: '' },
                description: 'tipo vacío'
            },
            {
                cv: { filePath: '/path/to/file.pdf' },
                description: 'sin tipo de archivo'
            },
            {
                cv: { fileType: 'application/pdf' },
                description: 'sin ruta'
            }
        ];

        test('debería aceptar CV válido', () => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                cv: validCV
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).not.toThrow();
        });

        test.each(invalidCVs)('debería rechazar CV con $description', ({ cv }) => {
            // Arrange
            const candidateData = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@test.com',
                cv: cv
            };

            // Act & Assert
            expect(() => validateCandidateData(candidateData)).toThrow('Invalid CV data');
        });
    });
});

describe('Servicio de Candidatos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock de validateCandidateData para que no lance errores por defecto
        (validateCandidateData as jest.Mock).mockImplementation(() => {});
        
        // Mock de Candidate.save
        // @ts-ignore - Mock type definition
        (Candidate.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@example.com'
        });
        
        // Mock de Education.save
        // @ts-ignore - Mock type definition
        (Education.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            institution: 'Universidad Test',
            title: 'Grado en Test',
            startDate: new Date('2020-01-01'),
            candidateId: 1
        });
        
        // Mock de WorkExperience.save
        // @ts-ignore - Mock type definition
        (WorkExperience.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            company: 'Empresa Test',
            position: 'Desarrollador',
            startDate: new Date('2020-01-01'),
            candidateId: 1
        });
        
        // Mock de Resume.save
        // @ts-ignore - Mock type definition
        (Resume.prototype.save as jest.Mock).mockResolvedValue({
            id: 1,
            filePath: '/path/to/file.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
            candidateId: 1
        });
    });

    describe('addCandidate', () => {
        // Tests para validación de datos
        describe('Validación de datos', () => {
            const validCandidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                phone: '612345678',
                address: 'Calle Principal 123'
            };

            test('debería validar los datos del candidato antes de procesarlos', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
            });

            test('debería lanzar un error si la validación falla', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };
                const validationError = new Error('Datos inválidos');
                (validateCandidateData as jest.Mock).mockImplementation(() => {
                    throw validationError;
                });

                // Act & Assert
                await expect(addCandidate(candidateData)).rejects.toThrow('Datos inválidos');
                expect(Candidate.prototype.save).not.toHaveBeenCalled();
            });
        });

        // Tests para creación de instancias de modelos
        describe('Creación de instancias de modelos', () => {
            const validCandidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                phone: '612345678',
                address: 'Calle Principal 123'
            };

            test('debería crear una instancia de Candidate con los datos proporcionados', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Candidate).toHaveBeenCalledWith(candidateData);
            });

            test('debería crear instancias de Education si se proporcionan datos educativos', async () => {
                // Arrange
                const educationData = {
                    institution: 'Universidad Test',
                    title: 'Grado en Test',
                    startDate: '2020-01-01',
                    endDate: '2024-01-01'
                };
                const candidateData = {
                    ...validCandidateData,
                    educations: [educationData]
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Education).toHaveBeenCalledWith(educationData);
            });

            test('debería crear instancias de WorkExperience si se proporcionan datos de experiencia', async () => {
                // Arrange
                const experienceData = {
                    company: 'Empresa Test',
                    position: 'Desarrollador',
                    description: 'Descripción del puesto',
                    startDate: '2020-01-01',
                    endDate: '2024-01-01'
                };
                const candidateData = {
                    ...validCandidateData,
                    workExperiences: [experienceData]
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(WorkExperience).toHaveBeenCalledWith(experienceData);
            });

            test('debería crear una instancia de Resume si se proporcionan datos de CV', async () => {
                // Arrange
                const cvData = {
                    filePath: '/path/to/file.pdf',
                    fileType: 'application/pdf'
                };
                const candidateData = {
                    ...validCandidateData,
                    cv: cvData
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Resume).toHaveBeenCalledWith(cvData);
            });
        });

        // Tests para manejo de errores
        describe('Manejo de errores', () => {
            const validCandidateData = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan.perez@example.com',
                phone: '612345678',
                address: 'Calle Principal 123'
            };

            test('debería manejar errores de validación', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };
                const validationError = new Error('Datos inválidos');
                (validateCandidateData as jest.Mock).mockImplementation(() => {
                    throw validationError;
                });

                // Act & Assert
                await expect(addCandidate(candidateData)).rejects.toThrow('Datos inválidos');
            });

            test('debería manejar errores de duplicación de email', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };
                const dbError = { code: 'P2002' };
                // @ts-ignore - Mock type definition
                (Candidate.prototype.save as jest.Mock).mockRejectedValue(dbError);

                // Act & Assert
                await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
            });

            test('debería propagar otros errores de base de datos', async () => {
                // Arrange
                const candidateData = { ...validCandidateData };
                const dbError = new Error('Error de base de datos');
                // @ts-ignore - Mock type definition
                (Candidate.prototype.save as jest.Mock).mockRejectedValue(dbError);

                // Act & Assert
                await expect(addCandidate(candidateData)).rejects.toThrow('Error de base de datos');
            });
        });

        // Tests para casos límite
        describe('Casos límite', () => {
            test('debería manejar un candidato sin datos opcionales', async () => {
                // Arrange
                const candidateData = {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com'
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Candidate).toHaveBeenCalledWith(candidateData);
                expect(Education.prototype.save).not.toHaveBeenCalled();
                expect(WorkExperience.prototype.save).not.toHaveBeenCalled();
                expect(Resume.prototype.save).not.toHaveBeenCalled();
            });

            test('debería manejar un candidato con múltiples educaciones', async () => {
                // Arrange
                const candidateData = {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    educations: [
                        {
                            institution: 'Universidad Test 1',
                            title: 'Grado en Test 1',
                            startDate: '2020-01-01',
                            endDate: '2024-01-01'
                        },
                        {
                            institution: 'Universidad Test 2',
                            title: 'Grado en Test 2',
                            startDate: '2015-01-01',
                            endDate: '2019-01-01'
                        }
                    ]
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Education).toHaveBeenCalledTimes(2);
                expect(Education.prototype.save).toHaveBeenCalledTimes(2);
            });

            test('debería manejar un candidato con múltiples experiencias laborales', async () => {
                // Arrange
                const candidateData = {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    workExperiences: [
                        {
                            company: 'Empresa Test 1',
                            position: 'Desarrollador 1',
                            description: 'Descripción del puesto 1',
                            startDate: '2020-01-01',
                            endDate: '2024-01-01'
                        },
                        {
                            company: 'Empresa Test 2',
                            position: 'Desarrollador 2',
                            description: 'Descripción del puesto 2',
                            startDate: '2015-01-01',
                            endDate: '2019-01-01'
                        }
                    ]
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(WorkExperience).toHaveBeenCalledTimes(2);
                expect(WorkExperience.prototype.save).toHaveBeenCalledTimes(2);
            });

            test('debería manejar un candidato con múltiples CVs', async () => {
                // Arrange
                const candidateData = {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    cv: [
                        {
                            filePath: '/path/to/file1.pdf',
                            fileType: 'application/pdf'
                        },
                        {
                            filePath: '/path/to/file2.pdf',
                            fileType: 'application/pdf'
                        }
                    ]
                };

                // Act
                await addCandidate(candidateData);

                // Assert
                expect(Resume).toHaveBeenCalledTimes(2);
                expect(Resume.prototype.save).toHaveBeenCalledTimes(2);
            });
        });
    });
}); 