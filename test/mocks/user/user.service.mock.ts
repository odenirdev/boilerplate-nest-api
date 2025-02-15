import { Result } from '@this/shared/utils/result';

export const mockUserService = {
  one: jest.fn().mockResolvedValue(
    Result.ok({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    }),
  ),
  create: jest.fn().mockResolvedValue(
    Result.ok({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    }),
  ),
};
