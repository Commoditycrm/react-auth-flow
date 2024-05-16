"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServer = void 0;
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const detector_1 = require("../env/detector");
exports.BaseServer = {
    init: (controllers, routePrefix = '') => {
        const app = (0, routing_controllers_1.createExpressServer)({
            controllers,
            // middlewares: [CustomErrorHandler],
            routePrefix,
        });
        //log requests
        app.use((0, morgan_1.default)((0, detector_1.isProduction)() ? 'combined' : 'dev'));
        // Handle undefined routes
        app.use((req, res, next) => {
            if (!res.headersSent) {
                res.status(404).send('Path Not Found');
            }
            else {
                next();
            }
        });
        app.use((0, cors_1.default)({
            credentials: true,
            maxAge: 600,
            methods: ['POST'],
            origin: 'https://react-flow-pi.vercel.app',
            preflightContinue: false,
            optionsSuccessStatus: 200,
        }));
        // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        //   res.status(501).send('Error happening');
        // });
        return app;
    },
    start: (app, port = 3000) => {
        // const server = app.listen(port, () => {
        //   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        // });
        if (!process.env.isVercel) {
            app.listen(port, () => {
                console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
            });
        }
        return app;
    },
};
