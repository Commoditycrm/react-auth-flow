"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvLoader = void 0;
var dotenv = __importStar(require("dotenv"));
var detector_1 = require("./detector");
exports.EnvLoader = {
    get: function (variableName) { return process.env[variableName]; },
    getOrThrow: function (variableName) {
        if (!process.env[variableName]) {
            throw new Error("".concat(variableName, " not defined in the environment"));
        }
        return process.env[variableName];
    },
    getInt: function (variableName) {
        if (process.env[variableName])
            return parseInt(process.env[variableName], 10);
        return undefined;
    },
    getIntOrThrow: function (variableName) {
        if (!process.env[variableName]) {
            throw new Error("".concat(variableName, " not defined in the environment"));
        }
        return parseInt(process.env[variableName], 10);
    },
    load: function () {
        var config = (0, detector_1.getEnvFileName)();
        console.log("Loading env ".concat(config));
        dotenv.config({ path: config });
    },
    //
    verify: function (variableNames) {
        for (var i = 0; i < variableNames.length; i++) {
            if (!process.env[variableNames[i]])
                throw new Error("Missing variable ".concat(variableNames[i]));
        }
    },
};
exports.EnvLoader.load();
