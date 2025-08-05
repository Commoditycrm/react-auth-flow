"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServer = void 0;
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const detector_1 = require("../env/detector");
const error_handler_1 = require("../error/error.handler");
const logger_1 = __importDefault(require("../logger"));
const allowOrigins = [process.env.BASE_URL, process.env.ADMIN_PANEL_URL, process.env.DEV_TESTING_URL];
exports.BaseServer = {
    init: (controllers, routePrefix = '') => {
        const app = (0, routing_controllers_1.createExpressServer)({
            controllers,
            cors: {
                origin: (origin, callback) => {
                    if (!origin || allowOrigins.includes(origin)) {
                        logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Request Origin:${origin}`);
                        return callback(null, true);
                    }
                    else {
                        return callback(new Error(`Not allowed by CORS:${origin}`));
                    }
                },
                credentials: true,
                methods: ['POST', 'OPTIONS'],
                maxAge: 600,
                optionsSuccessStatus: 200,
            },
            middlewares: [error_handler_1.CustomErrorHandler],
            routePrefix,
        });
        app.use((0, morgan_1.default)((0, detector_1.isProduction)() ? 'combined' : 'dev'));
        // ❌ REMOVE this manual CORS middleware — it's redundant and causes ERR_HTTP_HEADERS_SENT
        // app.use(
        //   cors({
        //     credentials: true,
        //     methods: ['POST', 'OPTIONS'],
        //     origin: process.env.ALLOWED_ORIGINS?.split(','),
        //     maxAge: 600,
        //     optionsSuccessStatus: 200,
        //   }),
        // );
        // ✅ Final 404 handler
        app.use((req, res, next) => {
            if (!res.headersSent) {
                res.status(404).send('Path Not Found');
            }
            else {
                next();
            }
        });
        return app;
    },
    start: (app, port = 4000) => {
        if (!process.env.isVercel) {
            app.listen(port, () => {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`⚡️[server]: Server is running at http://localhost:${port}`);
            });
        }
        return app;
    },
};
