// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import fs from 'fs';

const production = 'production';
const development = 'development';
const staging = 'staging';
const local = 'local';
const CI = 'CI';

const isProduction = () => process.env.NODE_ENV === production;

const isDevelopment = () => process.env.NODE_ENV === development;

const isStaging = () => process.env.NODE_ENV === staging;

const isCI = () =>
  /** To supress jest verbose / warnings or to use the .env.test files */
  process.env.NODE_ENV === CI || process.env.NODE_ENV === 'test';

const isLocal = () =>
  process.env.NODE_ENV === 'undefined' ||
  (!isProduction() && !isStaging() && !isDevelopment() && !isCI());

const getEnvFileName = () => {
  const envName = process.env.NODE_ENV;
  if (fs.existsSync(`.env.${envName || 'local'}`)) {
    return `.env.${envName || 'local'}`;
  }
};

export {
  getEnvFileName,
  isCI,
  isDevelopment,
  isLocal,
  isProduction,
  isStaging,
};
