import { Request, Response } from 'express';

// Mock Express request and response
jest.mock('express', () => ({
  Request: jest.fn(),
  Response: jest.fn(),
}));

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test cleanup
afterAll(() => {
  // Add any global cleanup here
});

// Add a test to make the file valid
test('setup file is loaded', () => {
  expect(true).toBeTruthy();
}); 