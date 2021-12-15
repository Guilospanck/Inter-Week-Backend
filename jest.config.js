module.exports = {
  roots: ['<rootDir>/src'],
  globals: {},
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/routes/*.ts',
    '!<rootDir>/src/app.module.ts',
    '!<rootDir>/src/mocks/**/*.ts',
    '!<rootDir>/src/shared/utils/*.ts'
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