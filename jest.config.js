import { createDefaultPreset } from 'ts-jest';

export default {
  testEnvironment: 'node',
  ...createDefaultPreset(),
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // This is the fix: Map .js imports to their actual .ts sources
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};