import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User('John Doe', 'john.doe@example.com', 'password123');
  });

  it('should create a user with the correct properties', () => {
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.id).toBe('');
  });

  it('should set a new password', () => {
    user.setPassword('newEncryptedPassword');
    expect(user['password']).toBe('newEncryptedPassword');
  });

  it('should validate the password correctly', () => {
    const compareFn = (raw: string, encrypted: string) => raw === encrypted;
    expect(user.validatePassword('password123', compareFn)).toBe(true);
    expect(user.validatePassword('wrongPassword', compareFn)).toBe(false);
  });

  it('should initialize with an id if provided', () => {
    const userWithId = new User(
      'Jane Doe',
      'jane.doe@example.com',
      'password123',
      '123',
    );
    expect(userWithId.id).toBe('123');
  });
});
