import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Permission])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
