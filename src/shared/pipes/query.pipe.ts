import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  transform(value: any) {
    const { page, limit, ...q } = value;
    return {
      page: Number.isNaN(Number(page)) ? 1 : Number(page),
      limit: Number.isNaN(Number(limit)) ? 10 : Number(limit),
      q,
    };
  }
}
