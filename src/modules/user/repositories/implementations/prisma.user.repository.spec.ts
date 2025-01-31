import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../entities/user.entity';
import { PrismaUserRepository } from './prisma.user.repository';
import { PrismaService } from '@this/shared/services/prisma/prisma.service';
import { Result } from '@this/shared/utils/result';

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
              create: jest.fn(),
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

  describe('create', () => {
    it('should create and return a new user', async () => {
      const user = new User('John Doe', 'john@example.com', 'password123', '1');
      const createdUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(createdUser);

      const result = await repository.create(user);

      expect(result).toEqual(Result.ok<User>(user));
      expect(createSpy).toHaveBeenCalledWith({
        data: {
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

      const result = await repository.one('1');

      expect(result).toEqual(
        Result.ok<User>(
          new User(user.name, user.email, user.password, user.id),
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

      const result = await repository.one('1');

      expect(result).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
