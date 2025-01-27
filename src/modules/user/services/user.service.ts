import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { Result } from '@this/shared/utils/result';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: UserDto): Promise<Result<User>> {
    const { name, email, password } = dto;

    const user = new User(name, email, password);

    return this.userRepository.create(user);
  }

  async one(id: string): Promise<Result<User>> {
    return this.userRepository.one(id);
  }
}
