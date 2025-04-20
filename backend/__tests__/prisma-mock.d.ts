// Definiciones de tipos para mocks de Prisma en tests

declare module '@prisma/client' {
  export class PrismaClient {
    candidate: {
      create: jest.Mock;
      update: jest.Mock;
      findUnique: jest.Mock;
    };
    $connect: jest.Mock;
    $disconnect: jest.Mock;
  }

  export namespace Prisma {
    export class PrismaClientInitializationError extends Error {
      name: string;
      constructor(message: string);
    }

    export class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: any;
      clientVersion: string;
      name: string;
      constructor(message: string, options: { code: string; clientVersion: string; meta?: any });
    }
  }
} 