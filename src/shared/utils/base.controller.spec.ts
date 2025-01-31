import { BaseController } from './base.controller';
import { Result } from './result';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('BaseController', () => {
  let baseController: BaseController;
  let mockResponse: Response;

  beforeEach(() => {
    baseController = new BaseController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  });

  it('should return success response with status code 200 by default', () => {
    const result = Result.ok({ data: 'test' });

    baseController.handleResult(result, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should return success response with custom status code', () => {
    const result = Result.ok({ data: 'test' });

    baseController.handleResult(result, mockResponse, HttpStatus.CREATED);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: 'test' });
  });

  it('should return failure response with status code 400', () => {
    const result = Result.fail('Error occurred');

    baseController.handleResult(result, mockResponse);

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
