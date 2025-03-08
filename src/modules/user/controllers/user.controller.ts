import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { BaseController } from '@this/shared/utils/base.controller';
import { Response } from 'express';
import { PaginatedRequestDto } from '@this/shared/dtos/paginated.request.dto';
import { QueryPipe } from '@this/shared/pipes/query.pipe';

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() userDto: UserDto, @Res() response: Response) {
    const result = await this.userService.create({ userDto });

    return this.handleResult(result, response, HttpStatus.CREATED);
  }

  @Get(':id')
  async one(@Param('id') id: string, @Res() response: Response) {
    const result = await this.userService.one({ id });

    return this.handleResult(result, response);
  }

  @Get()
  @UsePipes(new QueryPipe())
  async paginate(
    @Query() params: PaginatedRequestDto<UserDto>,
    @Res() response: Response,
  ) {
    const result = await this.userService.paginate(params);

    return this.handleResult(result, response);
  }
}
