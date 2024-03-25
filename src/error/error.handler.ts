import { Request, Response } from 'express';
import { FirebaseError } from 'firebase-admin';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { ERROR_MESSAGES, FIREBASE_ERROR_CODES } from './error.codes';

@Middleware({ type: 'after', priority: 100 })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: FirebaseError, req: Request, res: Response) {
    if (err?.code && FIREBASE_ERROR_CODES[err.code]) {
      const error = FIREBASE_ERROR_CODES[err.code];
      const specificErrorMessage = ERROR_MESSAGES[error.errorCode];

      return res.status(403).json({
        code: error.errorCode,
        message: specificErrorMessage,
      });
    }

    // logger.error(`Execution failed: ${err}`);

    const errorMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
    });
  }
}
