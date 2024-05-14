"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServer = void 0;
var morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
var routing_controllers_1 = require("routing-controllers");
var detector_1 = require("../env/detector");
exports.BaseServer = {
    init: function (controllers, routePrefix) {
        if (routePrefix === void 0) { routePrefix = ''; }
        var app = (0, routing_controllers_1.createExpressServer)({
            controllers: controllers,
            // middlewares: [CustomErrorHandler],
            routePrefix: routePrefix,
        });
        //log requests
        app.use((0, morgan_1.default)((0, detector_1.isProduction)() ? 'combined' : 'dev'));
        // Handle undefined routes
        app.use(function (req, res, next) {
            if (!res.headersSent) {
                res.status(404).send('Path Not Found');
            }
            else {
                next();
            }
        });
        // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        //   res.status(501).send('Error happening');
        // });
        return app;
    },
    start: function (app, port) {
        if (port === void 0) { port = 3000; }
        var server = app.listen(port, function () {
            console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
        });
        return server;
    },
};
