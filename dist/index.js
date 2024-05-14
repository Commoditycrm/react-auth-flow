"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var main_1 = require("./controllers/main");
var base_server_1 = require("./server/base.server");
// Initialize server with controllers
exports.app = base_server_1.BaseServer.init([main_1.FirebaseUserController], '/api');
//TODO: setup logger, setup error handler
// Start server
base_server_1.BaseServer.start(exports.app, 3000);
