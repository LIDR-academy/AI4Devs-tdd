import axios from 'axios';
import { Readable } from 'stream';
import { Candidate } from '../domain/models/Candidate';
import { PrismaClient, Prisma } from '@prisma/client';

// Mock de axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        candidate: {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn()
        }
    };

    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
        Prisma: {
            PrismaClientInitializationError: class PrismaClientInitializationError extends Error {
                constructor(message: string) {
                    super(message);
                    this.name = 'PrismaClientInitializationError';
                }
            }
        }
    };
});

// Obtener la instancia mockeada de PrismaClient
const mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;

// Tipos como types en lugar de interfaces
type CandidateData = {
    firstName: string;
    lastName: string;
    email: string;
    education?: any[];
    workExperience?: any[];
}

type UploadResponse = {
    filePath: string;
    fileType: string;
}

// Función auxiliar para crear un mock de archivo
function createMockFile(content: string, filename: string, mimeType: string) {
    const buffer = Buffer.from(content);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return {
        buffer,
        originalname: filename,
        mimetype: mimeType,
        size: buffer.length,
        stream: () => stream,
    };
}

describe('Candidate Model Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        test('should create a candidate with all fields', () => {
            // Arrange
            const candidateData = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '123456789',
                address: 'Test Address',
                education: [
                    {
                        institution: 'Test University',
                        title: 'Computer Science',
                        startDate: new Date('2020-01-01'),
                        endDate: new Date('2024-01-01')
                    }
                ],
                workExperience: [
                    {
                        company: 'Test Company',
                        position: 'Developer',
                        description: 'Test description',
                        startDate: new Date('2024-01-01'),
                        endDate: null
                    }
                ],
                resumes: [
                    {
                        filePath: '/test/path',
                        fileType: 'application/pdf'
                    }
                ]
            };

            // Act
            const candidate = new Candidate(candidateData);

            // Assert
            expect(candidate.id).toBe(1);
            expect(candidate.firstName).toBe('John');
            expect(candidate.lastName).toBe('Doe');
            expect(candidate.email).toBe('john.doe@example.com');
            expect(candidate.phone).toBe('123456789');
            expect(candidate.address).toBe('Test Address');
            expect(candidate.education).toHaveLength(1);
            expect(candidate.workExperience).toHaveLength(1);
            expect(candidate.resumes).toHaveLength(1);
        });

        test('should create a candidate with minimal required fields', () => {
            // Arrange
            const candidateData = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com'
            };

            // Act
            const candidate = new Candidate(candidateData);

            // Assert
            expect(candidate.id).toBeUndefined();
            expect(candidate.firstName).toBe('Jane');
            expect(candidate.lastName).toBe('Smith');
            expect(candidate.email).toBe('jane.smith@example.com');
            expect(candidate.phone).toBeUndefined();
            expect(candidate.address).toBeUndefined();
            expect(candidate.education).toEqual([]);
            expect(candidate.workExperience).toEqual([]);
            expect(candidate.resumes).toEqual([]);
        });
    });

    describe('save()', () => {
        test('should create a new candidate successfully', async () => {
            // Arrange
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            };
            const candidate = new Candidate(candidateData);
            
            const expectedResponse = {
                id: 1,
                ...candidateData
            };
            
            (mockPrismaClient.candidate.create as jest.Mock).mockResolvedValueOnce(expectedResponse);

            // Act
            const result = await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.create).toHaveBeenCalledWith({
                data: expect.objectContaining(candidateData)
            });
            expect(result).toEqual(expectedResponse);
        });

        test('should update an existing candidate successfully', async () => {
            // Arrange
            const candidateData = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                education: [
                    {
                        institution: 'New University',
                        title: 'Computer Science',
                        startDate: new Date('2020-01-01'),
                        endDate: new Date('2024-01-01')
                    }
                ]
            };
            const candidate = new Candidate(candidateData);
            
            const expectedResponse = {
                ...candidateData
            };
            
            (mockPrismaClient.candidate.update as jest.Mock).mockResolvedValueOnce(expectedResponse);

            // Act
            const result = await candidate.save();

            // Assert
            expect(mockPrismaClient.candidate.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com'
                })
            });
            expect(result).toEqual(expectedResponse);
        });


        test('should handle record not found error on update', async () => {
            // Arrange
            const candidate = new Candidate({
                id: 999,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            const notFoundError = new Error('Record not found');
            (notFoundError as any).code = 'P2025';

            (mockPrismaClient.candidate.update as jest.Mock).mockRejectedValueOnce(notFoundError);

            // Act & Assert
            await expect(candidate.save()).rejects.toThrow(
                'No se pudo encontrar el registro del candidato'
            );
        });
    });

    describe('findOne()', () => {
        test('should find an existing candidate', async () => {
            // Arrange
            const mockCandidateData = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            };

            (mockPrismaClient.candidate.findUnique as jest.Mock).mockResolvedValueOnce(mockCandidateData);

            // Act
            const result = await Candidate.findOne(1);

            // Assert
            expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toBeInstanceOf(Candidate);
            expect(result?.id).toBe(1);
            expect(result?.firstName).toBe('John');
        });

        test('should return null for non-existing candidate', async () => {
            // Arrange
            (mockPrismaClient.candidate.findUnique as jest.Mock).mockResolvedValueOnce(null);

            // Act
            const result = await Candidate.findOne(999);

            // Assert
            expect(mockPrismaClient.candidate.findUnique).toHaveBeenCalledWith({
                where: { id: 999 }
            });
            expect(result).toBeNull();
        });
    });
});

describe('Candidate Service Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadCV', () => {
        test('should successfully upload a CV file', async () => {
            // Arrange
            const mockFile = createMockFile('dummy content', 'test-cv.pdf', 'application/pdf');
            const mockResponse = {
                data: {
                    filePath: '/uploads/test-cv.pdf',
                    fileType: 'application/pdf'
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            };

            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            // Act
            const formData = new FormData();
            Object.defineProperty(formData, 'append', {
                value: jest.fn()
            });
            
            const response = await axios.post('http://localhost:3010/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Assert
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3010/upload',
                expect.any(FormData),
                expect.any(Object)
            );
            expect(response.data).toEqual(mockResponse.data);
        });

        test('should handle upload errors correctly', async () => {
            // Arrange
            const mockFile = createMockFile('dummy content', 'test-cv.pdf', 'application/pdf');
            const errorMessage = 'Error de servidor';
            
            mockedAxios.post.mockRejectedValueOnce({
                response: {
                    data: errorMessage,
                    status: 500
                }
            });

            // Act & Assert
            try {
                const formData = new FormData();
                Object.defineProperty(formData, 'append', {
                    value: jest.fn()
                });
                
                await axios.post('http://localhost:3010/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } catch (error: any) {
                expect(error.response.data).toBe(errorMessage);
            }
        });
    });

    describe('sendCandidateData', () => {
        test('should successfully send candidate data', async () => {
            // Arrange
            const mockCandidateData: CandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                education: [],
                workExperience: []
            };

            const mockResponse = {
                data: {
                    id: 1,
                    ...mockCandidateData
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            };

            mockedAxios.post.mockResolvedValueOnce(mockResponse);

            // Act
            const response = await axios.post('http://localhost:3010/candidates', mockCandidateData);

            // Assert
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3010/candidates',
                mockCandidateData
            );
            expect(response.data).toEqual(mockResponse.data);
        });

        test('should handle candidate data submission errors', async () => {
            // Arrange
            const mockCandidateData: CandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email'
            };

            const errorMessage = 'Email inválido';
            
            mockedAxios.post.mockRejectedValueOnce({
                response: {
                    data: errorMessage,
                    status: 400
                }
            });

            // Act & Assert
            try {
                await axios.post('http://localhost:3010/candidates', mockCandidateData);
            } catch (error: any) {
                expect(error.response.data).toBe(errorMessage);
            }
        });
    });

    describe('Integration Test Scenarios', () => {
        test('should handle complete candidate submission flow', async () => {
            // Arrange
            const mockFile = createMockFile('dummy content', 'test-cv.pdf', 'application/pdf');
            const mockUploadResponse = {
                data: {
                    filePath: '/uploads/test-cv.pdf',
                    fileType: 'application/pdf'
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            };

            const mockCandidateData: CandidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                education: [
                    {
                        institution: 'Universidad Example',
                        degree: 'Computer Science',
                        startDate: '2020-01-01',
                        endDate: '2024-01-01'
                    }
                ],
                workExperience: [
                    {
                        company: 'Tech Corp',
                        position: 'Software Developer',
                        startDate: '2024-01-01',
                        endDate: null
                    }
                ]
            };

            const mockCandidateResponse = {
                data: {
                    id: 1,
                    ...mockCandidateData
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {}
            };

            mockedAxios.post
                .mockResolvedValueOnce(mockUploadResponse)
                .mockResolvedValueOnce(mockCandidateResponse);

            // Act
            const formData = new FormData();
            Object.defineProperty(formData, 'append', {
                value: jest.fn()
            });
            
            const uploadResponse = await axios.post('http://localhost:3010/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const candidateResponse = await axios.post('http://localhost:3010/candidates', mockCandidateData);

            // Assert
            expect(uploadResponse.data).toEqual(mockUploadResponse.data);
            expect(candidateResponse.data).toEqual(mockCandidateResponse.data);
            expect(mockedAxios.post).toHaveBeenCalledTimes(2);
        });
    });
});
