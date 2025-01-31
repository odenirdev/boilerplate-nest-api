import { User } from './user.entity';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });
  });

  it('should create a user with the correct properties', () => {
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.id).toBe('');
  });

  it('should set a new password', () => {
    user.setPassword({
      encryptedPassword: 'newEncryptedPassword',
    });
    expect(user['password']).toBe('newEncryptedPassword');
  });

  it('should validate the password correctly', () => {
    const compareFn = (raw: string, encrypted: string) => raw === encrypted;
    expect(
      user.validatePassword({
        rawPassword: 'password',
        compareFn,
      }),
    ).toBe(true);
    expect(
      user.validatePassword({
        rawPassword: 'wrongPassword',
        compareFn,
      }),
    ).toBe(false);
  });

  it('should initialize with an id if provided', () => {
    const userWithId = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      id: 'uuid',
    });
    expect(userWithId.id).toBe('uuid');
  });
});
