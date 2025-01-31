import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { Result } from '@this/shared/utils/result';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            one: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return success result', async () => {
      const userDto: UserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const user = new User({
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
      });
      const result = Result.ok(user);

      jest.spyOn(userRepository, 'create').mockResolvedValue(result);

      const serviceResult = await userService.create({ userDto });

      expect(userRepository.create).toHaveBeenCalledWith({
        user,
      });
      expect(serviceResult).toEqual(result);
    });

    it('should return failure result if user creation fails', async () => {
      const userDto: UserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const result = Result.fail<User>('Error creating user');

      jest.spyOn(userRepository, 'create').mockResolvedValue(result);

      const serviceResult = await userService.create({ userDto });

      expect(userRepository.create).toHaveBeenCalledWith({
        user: expect.any(User),
      });
      expect(serviceResult).toEqual(result);
    });
  });

  describe('one', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id,
      });
      const result = Result.ok(user);

      jest.spyOn(userRepository, 'one').mockResolvedValue(result);

      const serviceResult = await userService.one({ id });

      expect(userRepository.one).toHaveBeenCalledWith({ id });
      expect(serviceResult).toEqual(result);
    });

    it('should return failure result if user not found', async () => {
      const id = '1';
      const result = Result.fail<User>('User not found');

      jest.spyOn(userRepository, 'one').mockResolvedValue(result);

      const serviceResult = await userService.one({ id });

      expect(userRepository.one).toHaveBeenCalledWith({ id });
      expect(serviceResult).toEqual(result);
    });
  });
});
