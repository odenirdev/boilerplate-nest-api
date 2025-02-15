import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { Result } from '@this/shared/utils/result';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { HttpStatus } from '@nestjs/common';
import { mockUserService } from '../../../../test/mocks/user/user.service.mock';
import { mockResponse } from '../../../../test/mocks/response';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return status 201', async () => {
      const userDto: UserDto = {
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
      };
      const result = Result.ok<User>(
        new User({
          name: userDto.name,
          email: userDto.email,
          password: userDto.password,
          id: '1',
        }),
      );

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      await userController.create(userDto, mockResponse as unknown as Response);

      expect(userService.create).toHaveBeenCalledWith({ userDto });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(result.getValue());
    });

    it('should return an error if creation fails', async () => {
      const userDto: UserDto = {
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
      };
      const result = Result.fail<User>('Error creating user');

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      await userController.create(userDto, mockResponse as unknown as Response);

      expect(userService.create).toHaveBeenCalledWith({ userDto });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: [result.getError()],
        statusCode: 500,
      });
    });
  });

  describe('one', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const dto: UserDto = {
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
      };
      const result = Result.ok<User>(
        new User({
          name: dto.name,
          email: dto.email,
          password: dto.password,
          id,
        }),
      );

      jest.spyOn(userService, 'one').mockResolvedValue(result);

      await userController.one(id, mockResponse as unknown as Response);

      expect(userService.one).toHaveBeenCalledWith({ id });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(result.getValue());
    });

    it('should return an error if user not found', async () => {
      const id = '1';
      const result = Result.fail<User>('User not found');

      jest.spyOn(userService, 'one').mockResolvedValue(result);

      await userController.one(id, mockResponse as unknown as Response);

      expect(userService.one).toHaveBeenCalledWith({ id });
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: [result.getError()],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
