import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkExperience {
    id?: number;
    company: string;
    position: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    candidateId?: number;

    constructor(data: any) {
        if (!data.company || !data.position || !data.startDate) {
            throw new Error('Missing required fields: company, position, and startDate are required');
        }

        this.id = data.id;
        this.company = data.company;
        this.position = data.position;
        this.description = data.description;
        this.startDate = new Date(data.startDate);
        this.endDate = data.endDate ? new Date(data.endDate) : undefined;
        this.candidateId = data.candidateId;
    }

    async save() {
        try {
            const workExperienceData: any = {
                company: this.company,
                position: this.position,
                description: this.description,
                startDate: this.startDate,
                endDate: this.endDate
            };

            if (this.candidateId !== undefined) {
                workExperienceData.candidateId = this.candidateId;
            }

            let result;
            if (this.id) {
                // Actualizar una experiencia laboral existente
                result = await prisma.workExperience.update({
                    where: { id: this.id },
                    data: workExperienceData
                });
            } else {
                // Crear una nueva experiencia laboral
                result = await prisma.workExperience.create({
                    data: workExperienceData
                });
            }

            return new WorkExperience(result);
        } catch (error: any) {
            if (error.name === 'PrismaClientInitializationError') {
                throw new Error('Failed to connect to database');
            }
            throw error;
        }
    }
}