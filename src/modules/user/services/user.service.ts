import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { Result } from '@this/shared/utils/result';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(params: { userDto: UserDto }): Promise<Result<User>> {
    const {
      userDto: { name, email, password },
    } = params;

    const user = new User({ name, email, password });

    return this.userRepository.create({ user });
  }

  async one(params: { id: string }): Promise<Result<User>> {
    const { id } = params;

    return this.userRepository.one({ id });
  }
}
