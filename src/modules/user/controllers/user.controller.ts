import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { BaseController } from '@this/shared/utils/base.controller';
import { Response } from 'express';

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: UserDto, @Res() response: Response) {
    const result = await this.userService.create(dto);

    return this.handleResult(result, response, HttpStatus.CREATED);
  }

  @Get(':id')
  async one(@Param('id') id: string, @Res() response: Response) {
    const result = await this.userService.one(id);

    return this.handleResult(result, response);
  }
}
