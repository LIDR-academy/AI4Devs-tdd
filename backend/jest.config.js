/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  moduleFileExtensions: ['js', 'json'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
}; 