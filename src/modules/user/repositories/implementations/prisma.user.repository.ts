import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from '@this/shared/services/prisma.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user['password'],
      },
    });

    return new User(
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.id,
    );
  }

  async one(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user
      ? new User(user.name, user.email, user.password, user.id)
      : null;
  }
}
