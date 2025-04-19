import { QueryPipe } from './query.pipe';

describe('QueryPipe', () => {
  let pipe: QueryPipe;

  beforeEach(() => {
    pipe = new QueryPipe();
  });

  it('should return default values when no page or limit provided', () => {
    const result = pipe.transform({});
    expect(result).toEqual({
      page: 1,
      limit: 10,
      q: {},
    });
  });

  it('should parse numeric page and limit correctly when provided as strings', () => {
    const result = pipe.transform({ page: '2', limit: '25' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(25);
    expect(result.q).toEqual({});
  });

  it('should default to 1 for invalid page values', () => {
    const result = pipe.transform({ page: 'abc', limit: '5' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(5);
  });

  it('should default to 10 for invalid limit values', () => {
    const result = pipe.transform({ page: '3', limit: 'xyz' });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
  });

  it('should include additional query parameters under q', () => {
    const result = pipe.transform({
      page: '1',
      limit: '1',
      search: 'term',
      sort: 'asc',
    });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.q).toEqual({ search: 'term', sort: 'asc' });
  });

  it('should handle numeric input for page and limit correctly', () => {
    const result = pipe.transform({ page: 4, limit: 20, filter: true });
    expect(result.page).toBe(4);
    expect(result.limit).toBe(20);
    expect(result.q).toEqual({ filter: true });
  });
});
