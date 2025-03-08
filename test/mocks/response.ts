export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;
