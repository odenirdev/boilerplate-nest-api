export class PaginatedResponseDto<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
