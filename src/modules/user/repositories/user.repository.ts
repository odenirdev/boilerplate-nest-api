import { Result } from '@this/shared/utils/result';
import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<Result<User>>;

  abstract one(id: string): Promise<Result<User | null>>;
}
