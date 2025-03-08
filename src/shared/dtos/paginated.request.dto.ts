import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaginatedRequestDto<T> {
  @ApiProperty({ description: 'Page number', example: 1 })
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsNotEmpty()
  limit: number;

  @ApiPropertyOptional({
    description: 'Query parameter',
    example: 'name=John&age=24',
  })
  @IsOptional()
  q?: T;
}
