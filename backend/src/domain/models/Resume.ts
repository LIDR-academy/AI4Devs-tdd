import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Resume {
    id?: number;
    candidateId: number;
    filePath: string;
    fileType: string;
    uploadDate: Date;

    constructor(data: any) {
        if (!data.candidateId || !data.filePath || !data.fileType) {
            throw new Error('Missing required fields: candidateId, filePath, and fileType are required');
        }

        this.id = data.id;
        this.candidateId = data.candidateId;
        this.filePath = data.filePath;
        this.fileType = data.fileType;
        this.uploadDate = new Date();
    }

    async save(): Promise<Resume> {
        try {
            if (!this.id) {
                return await this.create();
            }
            throw new Error('No se permite la actualización de un currículum existente.');
        } catch (error: any) {
            if (error.name === 'PrismaClientInitializationError') {
                throw new Error('Failed to connect to database');
            }
            throw error;
        }
    }

    async create(): Promise<Resume> {
        const createdResume = await prisma.resume.create({
            data: {
                candidateId: this.candidateId,
                filePath: this.filePath,
                fileType: this.fileType,
                uploadDate: this.uploadDate
            },
        });
        return new Resume(createdResume);
    }
}