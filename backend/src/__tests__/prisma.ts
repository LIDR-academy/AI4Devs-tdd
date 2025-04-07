import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Ensure test environment variables are loaded
dotenv.config({ path: '.env.test' });

// Make sure we're using the test database connection
const dbName = process.env.DB_NAME || 'LTIdb_test';
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT || '5432';

// Set DATABASE_URL using the environment variables
process.env.DATABASE_URL = `postgresql://${dbUser}:${dbPassword}@localhost:${dbPort}/${dbName}`;

// Create a singleton Prisma client for testing
const prisma = new PrismaClient();

export default prisma; 