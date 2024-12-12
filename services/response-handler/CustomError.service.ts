import { HttpError } from 'routing-controllers';

export class CustomError extends HttpError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
  }

  toJSON() {
    return {
      status: this.httpCode,
      type: 'Err',
      message: this.message,
      data: null,
    };
  }
}
