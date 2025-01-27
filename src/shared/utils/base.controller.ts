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
      return response.status(400).json({ message: result.getError() });
    }

    return response.status(statusCode).json(result.getValue());
  }
}
