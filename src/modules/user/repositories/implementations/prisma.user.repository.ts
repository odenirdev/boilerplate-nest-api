import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from '@this/shared/services/prisma/prisma.service';
import { User } from '../../entities/user.entity';
import { Result } from '@this/shared/utils/result';
import { PaginatedResponseDto } from '@this/shared/dtos/paginated.response.dto';
import { UserDto } from '../../dtos/user.dto';
import { PaginatedRequestDto } from '@this/shared/dtos/paginated.request.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(params: { user: User }): Promise<Result<User>> {
    try {
      const { user } = params;

      const upsertedUser = await this.prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          password: user['password'],
        },
        create: {
          name: user.name,
          email: user.email,
          password: user['password'],
        },
      });

      return Result.ok<User>(
        new User({
          name: upsertedUser.name,
          email: upsertedUser.email,
          password: upsertedUser.password,
          id: upsertedUser.id,
        }),
      );
    } catch (error) {
      return Result.fail<User>(error.message);
    }
  }

  async one(params: { id: string }): Promise<Result<User | null>> {
    const { id } = params;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user
      ? Result.ok<User>(
          new User({
            name: user.name,
            email: user.email,
            password: user.password,
            id: user.id,
          }),
        )
      : null;
  }

  async findByEmail(params: { email: string }): Promise<Result<User>> {
    const { email } = params;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Result.fail<User>('User not found');
    }

    return Result.ok<User>(
      new User({
        name: user.name,
        email: user.email,
        password: user.password,
        id: user.id,
      }),
    );
  }

  async paginate(
    params: PaginatedRequestDto<Partial<UserDto>>,
  ): Promise<Result<PaginatedResponseDto<User>>> {
    const page = Number(params.page);
    const limit = Number(params.limit);
    const { q } = params;

    const where = Object.keys(q || {}).reduce((acc, key) => {
      if (q[key]) {
        acc[key] = {
          contains: q[key],
        };
      }
      return acc;
    }, {});

    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
    });

    return Result.ok<PaginatedResponseDto<User>>({
      items: users.map((user) => {
        return new User({
          name: user.name,
          email: user.email,
          password: user.password,
          id: user.id,
        });
      }),
      page,
      limit,
      total: await this.prisma.user.count({ where }),
    });
  }
}
