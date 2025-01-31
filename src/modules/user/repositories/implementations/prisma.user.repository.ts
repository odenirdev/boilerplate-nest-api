import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from '@this/shared/services/prisma/prisma.service';
import { User } from '../../entities/user.entity';
import { Result } from '@this/shared/utils/result';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: { user: User }): Promise<Result<User>> {
    try {
      const { user } = params;

      const createdUser = await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user['password'],
        },
      });

      return Result.ok<User>(
        new User({
          name: createdUser.name,
          email: createdUser.email,
          password: createdUser.password,
          id: createdUser.id,
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
}
