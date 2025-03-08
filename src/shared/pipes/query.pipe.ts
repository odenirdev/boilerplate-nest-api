import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  transform(value: any) {
    const { page, limit, ...q } = value;
    return {
      page: Number(page),
      limit: Number(limit),
      q,
    };
  }
}
