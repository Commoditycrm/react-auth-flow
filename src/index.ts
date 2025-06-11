import { FirebaseUserController } from './controllers/main';
import ProjectController from './controllers/projectController';
import { BaseServer } from './server/base.server';

// Initialize server with controllers
const app = BaseServer.init(
  [FirebaseUserController, ProjectController],
  '/api',
);

//TODO: setup logger, setup error handler
// Start server
const server = BaseServer.start(app, 4000);

export default server;
