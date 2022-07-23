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
        branches: 40,
        statements: 40,
        functions: 40,
        lines: 40,
      },
    },
    globals: {
      'ts-jest': {
        isolatedModules: !!process.env.SKIP_TYPE_CHECK || false,
      },
    },
    coveragePathIgnorePatterns: [
      '<rootDir>/test/',
      '/src/utils/logger.ts', // this is all a mock anyways
      '/node_modules/',
    ],
    setupFilesAfterEnv: ['<rootDir>/test/unit/helpers/setup.ts'],
    testMatch: ['<rootDir>/test/unit/**/*.test.{ts,tsx}'],
  };
  