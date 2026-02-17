import { createDefaultEsmPreset } from 'ts-jest';

const defaultEsmPreset = createDefaultEsmPreset();

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  ...defaultEsmPreset,
  testEnvironment: 'node',
  // This tells ts-jest to treat .ts files as ESM
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // This allows you to use .js extensions in your imports (required by ESM)
    // while still letting Jest find the .ts source files.
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    ...defaultEsmPreset.transform,
    // Ensure ts-jest is configured for ESM
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};