import prisma from './prisma';

describe('Database Connection', () => {
  it('should connect to the test database', async () => {
    // Log out current connection info from env vars
    // console.log(`Using database: ${process.env.DB_NAME}`);

    // Execute a query to test the connection
    const result = await prisma.$queryRaw<Array<{ current_database: string }>>`SELECT current_database()`;
    // console.log('Connected to database:', result);

    // Verify we're connecting to the test database
    expect(result[0].current_database).toBe('LTIdb_test');
  });
});
