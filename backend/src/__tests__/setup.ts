import prisma from './prisma';

// Clean up the database before each test
beforeEach(async () => {
  // Truncate all tables
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  
  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
      );
    }
  }
});

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
}); 