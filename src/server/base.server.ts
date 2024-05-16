import cors from 'cors';
import { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { isProduction } from '../env/detector';

export const BaseServer = {
  init: (controllers: Array<Function>, routePrefix: string = '') => {
    const app = createExpressServer({
      controllers,
      // middlewares: [CustomErrorHandler],
      routePrefix,
    });

    //log requests
    app.use(morgan(isProduction() ? 'combined' : 'dev'));
    // Handle undefined routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!res.headersSent) {
        res.status(404).send('Path Not Found');
      } else {
        next();
      }
    });

    app.use(
      cors(),
      //   {
      //   credentials: true,
      //   maxAge: 600,
      //   methods: ['POST'],
      //   origin: 'https://react-flow-pi.vercel.app',
      //   preflightContinue: false,
      //   optionsSuccessStatus: 200,
      // }
    );

    // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //   res.status(501).send('Error happening');
    // });

    return app;
  },

  start: (app: Express, port: number = 3000) => {
    // const server = app.listen(port, () => {
    //   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    // });

    if (!process.env.isVercel) {
      app.listen(port, () => {
        console.log(
          `⚡️[server]: Server is running at http://localhost:${port}`,
        );
      });
    }

    return app;
  },
};
