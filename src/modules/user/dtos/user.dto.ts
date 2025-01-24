import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "User's password (minimum 8 characters)",
    example: 'password123',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

export class UserResponseDTO {
  @ApiProperty({
    description: 'Unique user ID',
    example: '123456',
  })
  readonly id: string;

  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  readonly name: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  readonly email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
