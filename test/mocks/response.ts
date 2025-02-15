export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
  links: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  jsonp: jest.fn().mockReturnThis(),
} as unknown as Response;
