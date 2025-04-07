import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const initializePrisma = (prismaInstance?: PrismaClient) => {
    prisma = prismaInstance || new PrismaClient();
};

export const addCandidate = async (candidateData: any) => {
    if (!prisma) {
        initializePrisma();
    }

    try {
        // Crear el candidato
        const candidate = await prisma.candidate.create({
            data: {
                firstName: candidateData.firstName,
                lastName: candidateData.lastName,
                email: candidateData.email,
                phone: candidateData.phone,
                address: candidateData.address
            }
        });

        // Si hay educación, crearla
        if (candidateData.educations) {
            for (const education of candidateData.educations) {
                await prisma.education.create({
                    data: {
                        ...education,
                        candidateId: candidate.id
                    }
                });
            }
        }

        // Si hay experiencia laboral, crearla
        if (candidateData.workExperiences) {
            for (const experience of candidateData.workExperiences) {
                await prisma.workExperience.create({
                    data: {
                        ...experience,
                        candidateId: candidate.id
                    }
                });
            }
        }

        // Si hay CV, crearlo
        if (candidateData.cv) {
            await prisma.resume.create({
                data: {
                    ...candidateData.cv,
                    candidateId: candidate.id
                }
            });
        }

        return candidate;
    } catch (error) {
        throw error;
    }
}; 