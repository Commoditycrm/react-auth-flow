import EventController from './controllers/eventController';
import { FirebaseUserController } from './controllers/main';
import OrganizationController from './controllers/organizationController';
import ProjectController from './controllers/projectController';
import { BaseServer } from './server/base.server';

// Initialize server with controllers
const app = BaseServer.init(
  [
    FirebaseUserController,
    ProjectController,
    OrganizationController,
    EventController,
  ],
  '/api',
);

//TODO: setup logger, setup error handler
// Start server
const server = BaseServer.start(app, 4000);

export default server;
