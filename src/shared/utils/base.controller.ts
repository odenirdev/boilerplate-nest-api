import { Response } from 'express';
import { Result, ResultStatus } from './result';
import { HttpStatus } from '@nestjs/common';

export class BaseController {
  handleResult(
    result: Result<any>,
    response: Response,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    if (result.status === ResultStatus.FAILURE) {
      const errorResponse = {
        message: [result.getError()],
        error: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(errorResponse);
    }

    return response.status(statusCode).json(result.getValue());
  }
}
