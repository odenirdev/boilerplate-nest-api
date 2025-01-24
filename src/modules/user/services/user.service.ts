import { Injectable } from '@nestjs/common';
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    const user = new User(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );

    const savedUser = await this.userRepository.create(user);

    return new UserResponseDTO(savedUser.id, savedUser.name, savedUser.email);
  }

  async one(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.one(id);

    if (!user) {
      throw new Error('User not found');
    }

    return new UserResponseDTO(user.id, user.name, user.email);
  }
}
