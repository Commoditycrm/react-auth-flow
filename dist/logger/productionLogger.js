"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const productionLogger = () => {
    const { timestamp, combine, printf, errors, splat } = winston_1.format;
    const line = printf((_a) => {
        var { level, message, timestamp, stack } = _a, meta = __rest(_a, ["level", "message", "timestamp", "stack"]);
        const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${level}] ${timestamp} ${stack !== null && stack !== void 0 ? stack : message}${extra}`;
    });
    return (0, winston_1.createLogger)({
        level: 'info',
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), splat(), line),
        transports: [
            new winston_1.transports.Console({ level: 'info' }),
            new winston_1.transports.File({ filename: 'myErrors.log' }),
        ],
    });
};
exports.default = productionLogger;
