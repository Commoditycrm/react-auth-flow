"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaging = exports.isProduction = exports.isLocal = exports.isDevelopment = exports.isCI = exports.getEnvFileName = void 0;
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
var fs_1 = __importDefault(require("fs"));
var production = 'production';
var development = 'development';
var staging = 'staging';
var local = 'local';
var CI = 'CI';
var isProduction = function () { return process.env.NODE_ENV === production; };
exports.isProduction = isProduction;
var isDevelopment = function () { return process.env.NODE_ENV === development; };
exports.isDevelopment = isDevelopment;
var isStaging = function () { return process.env.NODE_ENV === staging; };
exports.isStaging = isStaging;
var isCI = function () {
    /** To supress jest verbose / warnings or to use the .env.test files */
    return process.env.NODE_ENV === CI || process.env.NODE_ENV === 'test';
};
exports.isCI = isCI;
var isLocal = function () {
    return process.env.NODE_ENV === 'undefined' ||
        (!isProduction() && !isStaging() && !isDevelopment() && !isCI());
};
exports.isLocal = isLocal;
var getEnvFileName = function () {
    var envName = process.env.NODE_ENV;
    if (fs_1.default.existsSync(".env.".concat(envName || 'local'))) {
        return ".env.".concat(envName || 'local');
    }
};
exports.getEnvFileName = getEnvFileName;
