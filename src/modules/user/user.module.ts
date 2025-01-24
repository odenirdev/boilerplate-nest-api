import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '@this/shared/services/prisma.service';
import { PrismaUserRepository } from './repositories/implementations/prisma.user.repository';

@Module({
  providers: [
    UserService,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
