import cors from 'cors';
import { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { isProduction } from '../env/detector';
import { CustomErrorHandler } from '../error/error.handler';
import logger from '../logger';

export const BaseServer = {
  init: (controllers: Array<Function>, routePrefix: string = '') => {
    const app = createExpressServer({
      controllers,
      // cors: {
      //   origin: '*',
      // },
      middlewares: [CustomErrorHandler],
      routePrefix,
    });

    //log requests
    app.use(morgan(isProduction() ? 'combined' : 'dev'));
    // Handle undefined routes

    app.use(
      cors({
        credentials: true,
        methods: ['POST', 'OPTIONS'],
        origin: process.env.ALLOWED_ORIGINS?.split(','),
        maxAge: 600,
        optionsSuccessStatus: 200,
      }),
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!res.headersSent) {
        res.status(404).send('Path Not Found');
      } else {
        next();
      }
    });

    // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //   res.status(501).send('Error happening');
    // });

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
