// jest.config.ts
import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    testTimeout: 30000,
  };
};
