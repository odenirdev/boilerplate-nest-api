import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { Result } from '@this/shared/utils/result';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            one: jest.fn(),
          },
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
      const res = mockResponse();

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      await userController.create(userDto, res);

      expect(userService.create).toHaveBeenCalledWith({ userDto });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(result.getValue());
    });

    it('should return an error if creation fails', async () => {
      const userDto: UserDto = {
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
      };
      const result = Result.fail<User>('Error creating user');
      const res = mockResponse();

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      await userController.create(userDto, res);

      expect(userService.create).toHaveBeenCalledWith({ userDto });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
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
      const res = mockResponse();

      jest.spyOn(userService, 'one').mockResolvedValue(result);

      await userController.one(id, res);

      expect(userService.one).toHaveBeenCalledWith({ id });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result.getValue());
    });

    it('should return an error if user not found', async () => {
      const id = '1';
      const result = Result.fail<User>('User not found');
      const res = mockResponse();

      jest.spyOn(userService, 'one').mockResolvedValue(result);

      await userController.one(id, res);

      expect(userService.one).toHaveBeenCalledWith({ id });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: [result.getError()],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
