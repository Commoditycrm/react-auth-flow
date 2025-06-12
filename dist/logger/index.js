"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const developmentLogger_1 = __importDefault(require("./developmentLogger"));
const productionLogger_1 = __importDefault(require("./productionLogger"));
let logger = null;
if (process.env.NODE_ENV === 'production') {
    logger = (0, productionLogger_1.default)();
}
if (process.env.NODE_ENV !== 'production') {
    logger = (0, developmentLogger_1.default)();
}
exports.default = logger;
