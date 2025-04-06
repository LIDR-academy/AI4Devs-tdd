import { addCandidate, initializePrisma } from '../../../application/services/candidateService';
import { mockPrisma } from '../../mocks/prisma.mock';
import { mockCandidateData } from '../../mocks/data/candidate.mock';

describe('CandidateService', () => {
    beforeEach(() => {
        // Limpiar todos los mocks antes de cada test
        jest.clearAllMocks();
        // Inicializar Prisma con el mock
        initializePrisma(mockPrisma as any);
    });

    describe('addCandidate', () => {
        test('debería insertar candidato básico correctamente', async () => {
            // Arrange
            const candidateData = mockCandidateData.basic;
            mockPrisma.candidate.create.mockResolvedValue({
                id: 1,
                ...candidateData
            });

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
            expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
                data: candidateData
            });
        });

        test('debería insertar candidato con educación', async () => {
            // Arrange
            const candidateData = {
                ...mockCandidateData.basic,
                educations: mockCandidateData.complete.educations
            };

            mockPrisma.candidate.create.mockResolvedValue({
                id: 1,
                ...mockCandidateData.basic
            });

            mockPrisma.education.create.mockResolvedValue({
                id: 1,
                candidateId: 1,
                ...mockCandidateData.complete.educations[0]
            });

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(result).toBeDefined();
            expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
            expect(mockPrisma.education.create).toHaveBeenCalledTimes(1);
            expect(mockPrisma.education.create).toHaveBeenCalledWith({
                data: {
                    ...mockCandidateData.complete.educations[0],
                    candidateId: 1
                }
            });
        });

        test('debería insertar candidato con experiencia laboral', async () => {
            // Arrange
            const candidateData = {
                ...mockCandidateData.basic,
                workExperiences: mockCandidateData.complete.workExperiences
            };

            mockPrisma.candidate.create.mockResolvedValue({
                id: 1,
                ...mockCandidateData.basic
            });

            mockPrisma.workExperience.create.mockResolvedValue({
                id: 1,
                candidateId: 1,
                ...mockCandidateData.complete.workExperiences[0]
            });

            // Act
            const result = await addCandidate(candidateData);

            // Assert
            expect(result).toBeDefined();
            expect(mockPrisma.candidate.create).toHaveBeenCalledTimes(1);
            expect(mockPrisma.workExperience.create).toHaveBeenCalledTimes(1);
            expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
                data: {
                    ...mockCandidateData.complete.workExperiences[0],
                    candidateId: 1
                }
            });
        });

        test('debería manejar error al insertar candidato', async () => {
            // Arrange
            const candidateData = mockCandidateData.basic;
            mockPrisma.candidate.create.mockRejectedValue(new Error('Error de base de datos'));

            // Act & Assert
            await expect(addCandidate(candidateData))
                .rejects
                .toThrow('Error de base de datos');
        });

        test('debería manejar error al insertar educación', async () => {
            // Arrange
            const candidateData = {
                ...mockCandidateData.basic,
                educations: mockCandidateData.complete.educations
            };

            mockPrisma.candidate.create.mockResolvedValue({
                id: 1,
                ...mockCandidateData.basic
            });

            mockPrisma.education.create.mockRejectedValue(new Error('Error al crear educación'));

            // Act & Assert
            await expect(addCandidate(candidateData))
                .rejects
                .toThrow('Error al crear educación');
        });
    });
}); 