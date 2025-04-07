export const PrismaClient = jest.fn().mockImplementation(() => ({
  candidate: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  education: {
    create: jest.fn(),
    update: jest.fn(),
  },
  workExperience: {
    create: jest.fn(),
    update: jest.fn(),
  },
  resume: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

export const Prisma = {
  PrismaClientInitializationError: jest.fn().mockImplementation(function() {
    return { name: 'PrismaClientInitializationError' };
  }),
  PrismaClientKnownRequestError: jest.fn().mockImplementation(function(message: string, { code }: { code: string }) {
    return { name: 'PrismaClientKnownRequestError', code, message };
  }),
}; 