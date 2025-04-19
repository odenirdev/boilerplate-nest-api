import { Result } from '@this/shared/core/result';
import { User } from '../entities/user.entity';
import { PaginatedRequestDto } from '@this/shared/dtos/paginated.request.dto';
import { PaginatedResponseDto } from '@this/shared/dtos/paginated.response.dto';
import { UserDto } from '../dtos/user.dto';

export abstract class UserRepository {
  abstract upsert(params: { user: User }): Promise<Result<User>>;

  abstract one(params: { id: string }): Promise<Result<User | null>>;

  abstract findByEmail(params: { email: string }): Promise<Result<User | null>>;

  abstract paginate(
    params: PaginatedRequestDto<Partial<UserDto>>,
  ): Promise<Result<PaginatedResponseDto<User>>>;
}
