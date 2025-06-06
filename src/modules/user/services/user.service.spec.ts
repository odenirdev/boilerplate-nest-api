import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { Result } from '@this/shared/core/result';

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
            upsert: jest.fn(),
            one: jest.fn(),
            findByEmail: jest.fn(),
            paginate: jest.fn(),
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

      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(Result.fail('User not found'));
      jest.spyOn(userRepository, 'upsert').mockResolvedValue(result);

      const serviceResult = await userService.create({ userDto });

      expect(userRepository.upsert).toHaveBeenCalledWith({
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

      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(Result.fail('User not found'));
      jest.spyOn(userRepository, 'upsert').mockResolvedValue(result);

      const serviceResult = await userService.create({ userDto });

      expect(userRepository.findByEmail).toHaveBeenCalledWith({
        email: userDto.email,
      });
      expect(userRepository.upsert).toHaveBeenCalledWith({
        user: expect.any(User),
      });
      expect(serviceResult).toEqual(result);
    });

    it('should return failure result if user already exists', async () => {
      const userDto: UserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const existingUser = new User({
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
      });
      const findResult = Result.ok(existingUser);

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(findResult);

      const serviceResult = await userService.create({ userDto });

      expect(userRepository.findByEmail).toHaveBeenCalledWith({
        email: userDto.email,
      });
      expect(serviceResult).toEqual(Result.fail('User already exists'));
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

  describe('paginate', () => {
    it('should return a paginated list of users', async () => {
      const users = [
        new User({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password',
        }),
      ];
      const result = Result.ok({
        items: users,
        total: 1,
        page: 1,
        limit: 10,
      });

      jest.spyOn(userRepository, 'paginate').mockResolvedValue(result);

      const serviceResult = await userService.paginate({ page: 1, limit: 10 });

      expect(userRepository.paginate).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(serviceResult).toEqual(result);
    });
  });
});
