import { Result } from '@this/shared/utils/result';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(params: { user: User }): Promise<Result<User>>;

  abstract one(params: { id: string }): Promise<Result<User | null>>;

  abstract findByEmail(params: { email: string }): Promise<Result<User | null>>;
}
