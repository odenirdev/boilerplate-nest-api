import { CoreController } from './controller';
import { Result } from './result';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { mockResponse } from '../../../test/mocks/response';

describe('CoreController', () => {
  let coreController: CoreController;

  beforeEach(() => {
    coreController = new CoreController();
  });

  it('should return success response with status code 200 by default', () => {
    const result = Result.ok({ data: 'test' });

    coreController.handleResult(result, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should return success response with custom status code', () => {
    const result = Result.ok({ data: 'test' });

    coreController.handleResult(
      result,
      mockResponse as unknown as Response,
      HttpStatus.CREATED,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should return failure response with status code 400', () => {
    const result = Result.fail('Error occurred');

    coreController.handleResult(result, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: ['Error occurred'],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
