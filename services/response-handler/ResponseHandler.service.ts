import { Response } from 'express';
import { STATUS_CODES } from '../../utils/constant';
import { CustomError } from './CustomError.service';

export class ResponseHandler {
  public responseHandler<T>(
    data?: T,
    message?: string,
    statusCode: number = STATUS_CODES.OK,
  ) {
    return {
      status: statusCode,
      type: data ? 'SUC' : 'ERR',
      message: message || '',
      error: null,
      data: data || null,
    };
  }

  public catchErrorHandler(
    errorMsg: string,
    errorCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  ): any {
    throw new CustomError(errorCode, errorMsg || 'Something went wrong.');
  }

  public apiResponseHandler<T>(res: Response, data: T) {
    return res?.json(data).end();
  }
}
