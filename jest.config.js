module.exports = {
  roots: ['<rootDir>/src'],
  globals: {},
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/routes/*.ts',
    '!<rootDir>/src/app.module.ts',
    '!<rootDir>/src/mocks/**/*.ts',
    '!<rootDir>/src/shared/utils/*.ts',
    '!<rootDir>/src/business/**/*.ts',
    '!<rootDir>/src/applications/errors/*.ts',
    '!<rootDir>/src/infrastructure/adapters/*.ts',
    '!<rootDir>/src/infrastructure/database/*.ts',
    '!<rootDir>/src/infrastructure/http_server/*.ts',
    '!<rootDir>/src/infrastructure/http.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/applications/$1',
    '@business/(.*)': '<rootDir>/src/business/$1',
    '@infra/(.*)': '<rootDir>/src/infrastructure/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1',
    '@shared_utils/(.*)': '<rootDir>/src/shared/utils/$1'
  }
}