/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        // ts-jest necesita 'node' — Next.js usa 'bundler' que no es compatible
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        jsx: 'react-jsx',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    }],
  },
};

module.exports = config;

