import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    return await this.userService.create(createUserDto);
  }

  @Get(':id')
  async one(@Param('id') id: string): Promise<UserResponseDTO> {
    return await this.userService.one(id);
  }
}
