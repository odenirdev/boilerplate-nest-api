import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { PrismaUserRepository } from './prisma.user.repository';
import { PrismaService } from '@this/shared/services/prisma/prisma.service';
import { Result, ResultStatus } from '@this/shared/utils/result';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              upsert: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('upsert', () => {
    it('should upsert and return user', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        id: '1',
      });
      const createdUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(prismaService.user, 'upsert')
        .mockResolvedValue(createdUser);

      const result = await repository.upsert({ user });

      expect(result).toEqual(Result.ok<User>(user));
      expect(createSpy).toHaveBeenCalledWith({
        where: { id: '1' },
        update: {
          name: 'John Doe',
          password: 'password123',
        },
        create: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });
    });

    it('should return a failure result if an error occurs', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        id: '1',
      });

      const createSpy = jest
        .spyOn(prismaService.user, 'upsert')
        .mockRejectedValue(new Error('Database error'));

      const result = await repository.upsert({ user });

      expect(result.status).toBe(ResultStatus.FAILURE);
      expect(result.getError()).toBe('Database error');
      expect(createSpy).toHaveBeenCalledWith({
        where: { id: '1' },
        update: {
          name: 'John Doe',
          password: 'password123',
        },
        create: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      });
    });
  });

  describe('one', () => {
    it('should return a user by id', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const findUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(user);

      const result = await repository.one({
        id: '1',
      });

      expect(result).toEqual(
        Result.ok<User>(
          new User({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          }),
        ),
      );
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if user not found', async () => {
      const findUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(null);

      const result = await repository.one({
        id: '1',
      });

      expect(result).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
