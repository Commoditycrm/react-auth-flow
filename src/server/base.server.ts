import { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { isProduction } from '../env/detector';
import { CustomErrorHandler } from '../error/error.handler';
import logger from '../logger';

const allowOrigins = [process.env.BASE_URL, process.env.ADMIN_PANEL_URL, process.env.DEV_TESTING_URL];

export const BaseServer = {
  init: (controllers: Array<Function>, routePrefix: string = '') => {
    const app = createExpressServer({
      controllers,
      cors: {
        origin: (origin: string, callback: Function) => {
          if (!origin || allowOrigins.includes(origin)) {
            logger?.info(`Request Origin:${origin}`);
            return callback(null, true);
          } else {
            return callback(new Error(`Not allowed by CORS:${origin}`));
          }
        },
        credentials: true,
        methods: ['POST', 'OPTIONS'],
        maxAge: 600,
        optionsSuccessStatus: 200,
      },
      middlewares: [CustomErrorHandler],
      routePrefix,
    });

    app.use(morgan(isProduction() ? 'combined' : 'dev'));

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
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!res.headersSent) {
        res.status(404).send('Path Not Found');
      } else {
        next();
      }
    });

    return app;
  },

  start: (app: Express, port: number = 4000) => {
    if (!process.env.isVercel) {
      app.listen(port, () => {
        logger?.info(
          `⚡️[server]: Server is running at http://localhost:${port}`,
        );
      });
    }

    return app;
  },
};
