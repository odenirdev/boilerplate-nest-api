import { Result } from '@this/shared/core/result';

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
  paginate: jest.fn().mockResolvedValue(
    Result.ok({
      items: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    }),
  ),
};
