import * as dotenv from 'dotenv';
import { getEnvFileName } from './detector';
import logger from '../logger';

export const EnvLoader = {
  get: (variableName: string) => process.env[variableName],
  getOrThrow: (variableName: string): string => {
    if (!process.env[variableName]) {
      throw new Error(`${variableName} not defined in the environment`);
    }
    return process.env[variableName] as string;
  },
  getInt: (variableName: string) => {
    if (process.env[variableName])
      return parseInt(process.env[variableName] as string, 10);
    return undefined;
  },
  getIntOrThrow: (variableName: string) => {
    if (!process.env[variableName]) {
      throw new Error(`${variableName} not defined in the environment`);
    }
    return parseInt(process.env[variableName] as string, 10);
  },
  load: () => {
    const config = getEnvFileName();
    logger?.info(`Loading env ${config}`);
    dotenv.config({ path: config });
  },
  //
  verify: (variableNames: string[]) => {
    for (let i = 0; i < variableNames.length; i++) {
      if (!process.env[variableNames[i]])
        throw new Error(`Missing variable ${variableNames[i]}`);
    }
  },
};

EnvLoader.load();
