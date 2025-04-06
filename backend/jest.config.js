/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [2345, 2339]  // Ignorar errores de tipo específicos
      }
    }]
  },
};