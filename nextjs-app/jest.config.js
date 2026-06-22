/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',

  // setupFilesAfterEnv: ejecuta código después de que el test environment está listo
  // Aquí se cargan los matchers de @testing-library/jest-dom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        jsx: 'react-jsx',
        paths: { '@/*': ['./src/*'] },
      },
    }],
  },
};

module.exports = config;
