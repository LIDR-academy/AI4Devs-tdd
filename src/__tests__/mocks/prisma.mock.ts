export const mockPrisma = {
    candidate: {
        create: jest.fn(),
        update: jest.fn()
    },
    education: {
        create: jest.fn()
    },
    workExperience: {
        create: jest.fn()
    },
    resume: {
        create: jest.fn()
    }
};

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => mockPrisma)
})); 