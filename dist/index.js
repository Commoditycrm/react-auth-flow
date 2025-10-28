"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventController_1 = __importDefault(require("./controllers/eventController"));
const main_1 = require("./controllers/main");
const organizationController_1 = __importDefault(require("./controllers/organizationController"));
const projectController_1 = __importDefault(require("./controllers/projectController"));
const base_server_1 = require("./server/base.server");
// Initialize server with controllers
const app = base_server_1.BaseServer.init([
    main_1.FirebaseUserController,
    projectController_1.default,
    organizationController_1.default,
    eventController_1.default,
], '/api');
//TODO: setup logger, setup error handler
// Start server
const server = base_server_1.BaseServer.start(app, 4000);
exports.default = server;
