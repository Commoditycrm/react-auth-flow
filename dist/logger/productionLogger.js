"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const productionLogger = () => {
    const { timestamp, combine, printf, json } = winston_1.format;
    const myFormat = printf(({ level, message, timestamp }) => {
        return `[${level}]:${timestamp} ${message} `;
    });
    return (0, winston_1.createLogger)({
        level: 'info',
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }), myFormat, json()),
        transports: [
            new winston_1.transports.Console(),
            new winston_1.transports.File({ filename: 'myErrors.log' }),
        ],
    });
};
exports.default = productionLogger;
