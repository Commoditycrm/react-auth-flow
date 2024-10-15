"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaging = exports.isProduction = exports.isLocal = exports.isDevelopment = exports.isCI = exports.getEnvFileName = void 0;
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
const fs_1 = __importDefault(require("fs"));
const production = 'production';
const development = 'development';
const staging = 'staging';
const local = 'local';
const CI = 'CI';
const isProduction = () => process.env.NODE_ENV === production;
exports.isProduction = isProduction;
const isDevelopment = () => process.env.NODE_ENV === development;
exports.isDevelopment = isDevelopment;
const isStaging = () => process.env.NODE_ENV === staging;
exports.isStaging = isStaging;
const isCI = () => 
/** To supress jest verbose / warnings or to use the .env.test files */
process.env.NODE_ENV === CI || process.env.NODE_ENV === 'test';
exports.isCI = isCI;
const isLocal = () => process.env.NODE_ENV === 'undefined' ||
    (!isProduction() && !isStaging() && !isDevelopment() && !isCI());
exports.isLocal = isLocal;
const getEnvFileName = () => {
    const envName = process.env.NODE_ENV;
    if (fs_1.default.existsSync(`.env.${envName || 'local'}`)) {
        return `.env.${envName || 'local'}`;
    }
};
exports.getEnvFileName = getEnvFileName;
