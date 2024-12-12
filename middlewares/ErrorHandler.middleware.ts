import * as express from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from 'routing-controllers';

import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public isProduction = env.isProduction;

  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public error(
    error: HttpError,
    req: express.Request,
    res: express.Response,
  ): void {
    res.status(error.httpCode || 500);
    res.json({
      status: error.httpCode,
      type: 'Err',
      message: error?.message,
      error: {
        message: error?.message,
        code: error?.httpCode,
      },
      data: null,
    });

    if (this.isProduction) {
      this.log.error(error.name, error.message);
    } else {
      this.log.error(error.name, error.stack);
    }
  }
}
