import { FirebaseUserController } from './controllers/main';
import { BaseServer } from './server/base.server';

// Initialize server with controllers
const app = BaseServer.init([FirebaseUserController], '/api');

//TODO: setup logger, setup error handler
// Start server
BaseServer.start(app, 3000);
