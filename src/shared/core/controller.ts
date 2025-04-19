import { Response } from 'express';
import { Result, ResultStatus } from './result';
import { HttpStatus } from '@nestjs/common';

export class CoreController {
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

    const data = result.getValue();
    delete data?.password;
    return response.status(statusCode).json(data);
  }
}
