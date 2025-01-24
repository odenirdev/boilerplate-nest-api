import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;

  abstract one(id: string): Promise<User | null>;
}
