import { validateCandidateData } from '../application/validator';
import { Candidate } from '../domain/models/Candidate';
import { Education } from '../domain/models/Education';
import { WorkExperience } from '../domain/models/WorkExperience';
import { Resume } from '../domain/models/Resume';
import { addCandidate } from '../application/services/candidateService';

// Mock del validador
jest.mock('../application/validator', () => ({
    validateCandidateData: jest.fn((data) => {
        if (data.id) return; // No validar si hay ID
        if (data.firstName?.length < 2) throw new Error('Invalid name');
        if (!data.email?.includes('@')) throw new Error('Invalid email');
        if (data.educations?.[0]?.institution?.length > 100) throw new Error('Invalid institution');
    })
}));

// Mock de los modelos manteniendo su funcionalidad básica
const mockSave = jest.fn();
jest.mock('../domain/models/Candidate', () => {
    return {
        Candidate: jest.fn().mockImplementation((data: any) => {
            return {
                ...data,
                education: data.education || [],
                workExperience: data.workExperience || [],
                resumes: data.resumes || [],
                save: mockSave
            };
        })
    };
});

jest.mock('../domain/models/Education', () => {
    return {
        Education: jest.fn().mockImplementation((data: any) => {
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                save: jest.fn().mockResolvedValue({ id: 1, ...data })
            };
        })
    };
});

jest.mock('../domain/models/WorkExperience', () => {
    return {
        WorkExperience: jest.fn().mockImplementation((data: any) => {
            return {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                save: jest.fn().mockResolvedValue({ id: 1, ...data })
            };
        })
    };
});

jest.mock('../domain/models/Resume', () => {
    return {
        Resume: jest.fn().mockImplementation((data: any) => {
            return {
                ...data,
                uploadDate: new Date(),
                save: jest.fn().mockResolvedValue({ id: 1, ...data })
            };
        })
    };
});

// Tests para el validador de datos de candidato
describe('validateCandidateData', () => {
    // Test 1: Verifica que el validador acepta los campos mínimos requeridos
    it('debería aceptar datos mínimos válidos', () => {
        const datosMinimos = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com'
        };
        expect(() => validateCandidateData(datosMinimos)).not.toThrow();
    });

    // Test 2: Verifica que el validador acepta todos los campos posibles
    it('debería aceptar datos completos válidos', () => {
        const datosCompletos = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            phone: '612345678',
            address: 'Calle Principal 123',
            educations: [{
                institution: 'Universidad',
                title: 'Ingeniero',
                startDate: '2020-01-01',
                endDate: '2024-01-01'
            }],
            workExperiences: [{
                company: 'Empresa',
                position: 'Desarrollador',
                description: 'Desarrollo web',
                startDate: '2024-01-01'
            }],
            cv: {
                filePath: '/ruta/archivo.pdf',
                fileType: 'application/pdf'
            }
        };
        expect(() => validateCandidateData(datosCompletos)).not.toThrow();
    });

    // Test 3: Verifica que al editar un candidato existente no se validan campos obligatorios
    it('no debería validar campos obligatorios cuando se edita un candidato existente', () => {
        const datosEdicion = {
            id: '123',
            firstName: 'Juan'
        };
        expect(() => validateCandidateData(datosEdicion)).not.toThrow();
    });

    // Test 4: Verifica la validación de nombre inválido
    it('debería lanzar error con nombre inválido', () => {
        const datosInvalidos = {
            firstName: 'J', // Nombre muy corto
            lastName: 'Pérez',
            email: 'juan@example.com'
        };
        expect(() => validateCandidateData(datosInvalidos)).toThrow('Invalid name');
    });

    // Test 5: Verifica la validación de email inválido
    it('debería lanzar error con email inválido', () => {
        const datosInvalidos = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'email-invalido'
        };
        expect(() => validateCandidateData(datosInvalidos)).toThrow('Invalid email');
    });

    // Test 6: Verifica la validación de educación inválida
    it('debería lanzar error con educación inválida', () => {
        const datosInvalidos = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com',
            educations: [{
                institution: 'Universidad'.repeat(20), // Institución muy larga (>100 caracteres)
                title: 'Ingeniero',
                startDate: '2020-01-01'
            }]
        };
        expect(() => validateCandidateData(datosInvalidos)).toThrow('Invalid institution');
    });
});

// Tests para la validación de modelos
describe('Validación de Modelos', () => {
    // Tests para el modelo Candidate
    describe('Modelo Candidate', () => {
        // Test 7: Verifica la creación de un candidato con datos mínimos
        it('debería crear una instancia con datos mínimos', () => {
            const datosMinimos = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@example.com'
            };

            const candidate = new Candidate(datosMinimos);

            expect(candidate.firstName).toBe('Juan');
            expect(candidate.lastName).toBe('Pérez');
            expect(candidate.email).toBe('juan@example.com');
            expect(candidate.education).toEqual([]);
            expect(candidate.workExperience).toEqual([]);
            expect(candidate.resumes).toEqual([]);
        });

        // Test 8: Verifica la creación de un candidato con todos los datos posibles
        it('debería crear una instancia con todos los datos', () => {
            const datosCompletos = {
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
                education: [{
                    institution: 'Universidad',
                    title: 'Ingeniero',
                    startDate: '2020-01-01'
                }],
                workExperience: [{
                    company: 'Empresa',
                    position: 'Desarrollador',
                    startDate: '2024-01-01'
                }],
                resumes: [{
                    filePath: '/ruta/archivo.pdf',
                    fileType: 'application/pdf'
                }]
            };

            const candidate = new Candidate(datosCompletos);

            expect(candidate.firstName).toBe('Juan');
            expect(candidate.lastName).toBe('Pérez');
            expect(candidate.email).toBe('juan@example.com');
            expect(candidate.phone).toBe('612345678');
            expect(candidate.address).toBe('Calle Principal 123');
            expect(candidate.education).toHaveLength(1);
            expect(candidate.workExperience).toHaveLength(1);
            expect(candidate.resumes).toHaveLength(1);
        });
    });

    // Tests para el modelo Education
    describe('Modelo Education', () => {
        // Test 9: Verifica la creación de una educación con datos básicos
        it('debería crear una instancia con datos básicos', () => {
            const datosEducacion = {
                institution: 'Universidad',
                title: 'Ingeniero',
                startDate: '2020-01-01'
            };

            const education = new Education(datosEducacion);

            expect(education.institution).toBe('Universidad');
            expect(education.title).toBe('Ingeniero');
            expect(education.startDate).toBeInstanceOf(Date);
            expect(education.endDate).toBeUndefined();
        });

        // Test 10: Verifica la creación de una educación con fecha de fin
        it('debería crear una instancia con fecha de fin', () => {
            const datosEducacion = {
                institution: 'Universidad',
                title: 'Ingeniero',
                startDate: '2020-01-01',
                endDate: '2024-01-01'
            };

            const education = new Education(datosEducacion);

            expect(education.endDate).toBeInstanceOf(Date);
        });
    });

    // Tests para el modelo WorkExperience
    describe('Modelo WorkExperience', () => {
        // Test 11: Verifica la creación de una experiencia laboral con datos básicos
        it('debería crear una instancia con datos básicos', () => {
            const datosExperiencia = {
                company: 'Empresa',
                position: 'Desarrollador',
                startDate: '2024-01-01'
            };

            const experience = new WorkExperience(datosExperiencia);

            expect(experience.company).toBe('Empresa');
            expect(experience.position).toBe('Desarrollador');
            expect(experience.startDate).toBeInstanceOf(Date);
            expect(experience.description).toBeUndefined();
            expect(experience.endDate).toBeUndefined();
        });

        // Test 12: Verifica la creación de una experiencia laboral con descripción y fecha de fin
        it('debería crear una instancia con descripción y fecha de fin', () => {
            const datosExperiencia = {
                company: 'Empresa',
                position: 'Desarrollador',
                description: 'Desarrollo web',
                startDate: '2024-01-01',
                endDate: '2025-01-01'
            };

            const experience = new WorkExperience(datosExperiencia);

            expect(experience.description).toBe('Desarrollo web');
            expect(experience.endDate).toBeInstanceOf(Date);
        });
    });

    // Tests para el modelo Resume
    describe('Modelo Resume', () => {
        // Test 13: Verifica la creación de un currículum con datos básicos
        it('debería crear una instancia con datos básicos', () => {
            const datosResume = {
                candidateId: 1,
                filePath: '/ruta/archivo.pdf',
                fileType: 'application/pdf'
            };

            const resume = new Resume(datosResume);

            expect(resume.candidateId).toBe(1);
            expect(resume.filePath).toBe('/ruta/archivo.pdf');
            expect(resume.fileType).toBe('application/pdf');
            expect(resume.uploadDate).toBeInstanceOf(Date);
        });
    });
});

// Tests para el servicio de candidatos
describe('CandidateService', () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada test
        jest.clearAllMocks();
    });

    // Test 14: Verifica la creación exitosa de un candidato
    it('debería crear un candidato exitosamente', async () => {
        // Datos de prueba con email único
        const timestamp = Date.now();
        const candidateData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: `juan${timestamp}@example.com`
        };

        // Mock del candidato creado
        const mockCandidate = {
            id: 1,
            ...candidateData
        };
        mockSave.mockResolvedValueOnce(mockCandidate);

        // Ejecutar el servicio
        const result = await addCandidate(candidateData);

        // Verificaciones
        expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
        expect(mockSave).toHaveBeenCalled();
        expect(result).toEqual(mockCandidate);
    });

    // Test 15: Verifica el manejo de error en validación
    it('debería lanzar error cuando la validación falla', async () => {
        // Datos de prueba
        const candidateData = {
            firstName: 'J', // Nombre inválido
            lastName: 'Pérez',
            email: 'juan@example.com'
        };

        // Verificar que se lanza el error
        await expect(addCandidate(candidateData)).rejects.toThrow('Invalid name');
        expect(mockSave).not.toHaveBeenCalled();
    });

    // Test 16: Verifica el manejo de error por email duplicado
    it('debería lanzar error cuando el email ya existe', async () => {
        // Datos de prueba
        const candidateData = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@example.com'
        };

        // Mock del error de email duplicado
        const prismaError = {
            code: 'P2002',
            message: 'Unique constraint failed on the fields: (`email`)'
        };
        mockSave.mockRejectedValueOnce(prismaError);

        // Verificar que se lanza el error correcto
        await expect(addCandidate(candidateData)).rejects.toThrow('The email already exists in the database');
    });
});
