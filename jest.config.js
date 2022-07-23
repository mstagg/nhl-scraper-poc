module.exports = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: [
      '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
      '<rootDir>/test/**/*.test.{js,jsx,ts,tsx}',
      '<rootDir>/lambda/**/*.test.{js,jsx,ts,tsx}',
    ],
    // Always use js and json first.  This order is used when parsing node_modules
    // and will crash when trying to compile deps.
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx', 'jsx', 'node', 'mjs'],
    clearMocks: true,
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 100,
        statements: 100,
        functions: 100,
        lines: 100,
      },
    },
    globals: {
      'ts-jest': {
        isolatedModules: !!process.env.SKIP_TYPE_CHECK || false,
      },
    },
    coveragePathIgnorePatterns: [
      '<rootDir>/test/',
      '/node_modules/',
    ],
    setupFilesAfterEnv: ['<rootDir>/test/unit/helpers/setup.ts'],
    testMatch: ['<rootDir>/test/unit/**/*.test.{ts,tsx}'],
  };
  