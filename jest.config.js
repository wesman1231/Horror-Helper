import { createDefaultPreset } from 'ts-jest';

export default {
  testEnvironment: 'node',
  ...createDefaultPreset(),
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // This regex catches imports ending in .ts and tells Jest to find the file
    '^(.+)\\.ts$': '$1',
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