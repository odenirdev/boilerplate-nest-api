import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

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
    it('should create a user', async () => {
      const createUserDto: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const userResponse: UserResponseDTO = { id: '1', ...createUserDto };
      jest.spyOn(userService, 'create').mockResolvedValue(userResponse);

      const result: UserResponseDTO =
        await userController.create(createUserDto);
      expect(result).toEqual(userResponse);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle errors', async () => {
      const createUserDto: CreateUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new Error('Error creating user'));

      await expect(userController.create(createUserDto)).rejects.toThrow(
        'Error creating user',
      );
    });
  });

  describe('one', () => {
    it('should return a user by id', async () => {
      const userResponse: UserResponseDTO = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };
      jest.spyOn(userService, 'one').mockResolvedValue(userResponse);

      const result: UserResponseDTO = await userController.one('1');
      expect(result).toEqual(userResponse);
      expect(userService.one).toHaveBeenCalledWith('1');
    });

    it('should handle errors', async () => {
      jest
        .spyOn(userService, 'one')
        .mockRejectedValue(new Error('User not found'));

      await expect(userController.one('1')).rejects.toThrow('User not found');
    });
  });
});
