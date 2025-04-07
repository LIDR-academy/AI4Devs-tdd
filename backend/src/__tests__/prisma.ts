import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Ensure test environment variables are loaded
dotenv.config({ path: '.env.test' });

// Create a singleton Prisma client for testing
const prisma = new PrismaClient();

export default prisma; 