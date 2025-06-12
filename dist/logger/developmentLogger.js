"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const developmentLogger = () => {
    const { combine, colorize, timestamp, printf } = winston_1.format;
    const myFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}]:${message}`;
    });
    return (0, winston_1.createLogger)({
        level: 'debug',
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:MM:SS' }), myFormat),
        transports: [new winston_1.transports.Console()],
    });
};
exports.default = developmentLogger;
