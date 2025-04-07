module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [151001]
      }
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/prisma/',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // Load test environment variables
  setupFiles: ['<rootDir>/node_modules/dotenv/config'],
  testEnvironmentOptions: {
    env: {
      NODE_ENV: 'test',
      DOTENV_CONFIG_PATH: '.env.test'
    },
  },
  // Exclude setup file from test runs
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/setup.ts'],
}; 