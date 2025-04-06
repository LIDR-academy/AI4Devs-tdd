module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Configuración para manejar las importaciones desde el backend
  moduleNameMapper: {
    '^../backend/(.*)$': '<rootDir>/backend/$1'
  }
}; 