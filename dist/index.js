"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./controllers/main");
const base_server_1 = require("./server/base.server");
// Initialize server with controllers
const app = base_server_1.BaseServer.init([main_1.FirebaseUserController], '/api');
//TODO: setup logger, setup error handler
// Start server
const server = base_server_1.BaseServer.start(app, 4000);
exports.default = server;
