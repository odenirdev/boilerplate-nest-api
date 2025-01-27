import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from '@this/shared/services/prisma/prisma.service';
import { User } from '../../entities/user.entity';
import { Result } from '@this/shared/utils/result';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<Result<User>> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user['password'],
      },
    });

    return Result.ok<User>(
      new User(
        createdUser.name,
        createdUser.email,
        createdUser.password,
        createdUser.id,
      ),
    );
  }

  async one(id: string): Promise<Result<User | null>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user
      ? Result.ok<User>(new User(user.name, user.email, user.password, user.id))
      : null;
  }
}
