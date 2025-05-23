import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { Result, ResultStatus } from '@this/shared/core/result';
import { PaginatedResponseDto } from '@this/shared/dtos/paginated.response.dto';
import { PaginatedRequestDto } from '@this/shared/dtos/paginated.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(params: { userDto: UserDto }): Promise<Result<User>> {
    const {
      userDto: { name, email, password },
    } = params;

    const findedUser = await this.userRepository.findByEmail({ email });
    if (findedUser.status === ResultStatus.SUCCESS) {
      return Result.fail('User already exists');
    }

    const user = new User({ name, email, password });

    return this.userRepository.upsert({ user });
  }

  async one(params: { id: string }): Promise<Result<User>> {
    const { id } = params;

    return this.userRepository.one({ id });
  }

  async paginate(
    params: PaginatedRequestDto<Partial<UserDto>>,
  ): Promise<Result<PaginatedResponseDto<User>>> {
    return this.userRepository.paginate(params);
  }
}
