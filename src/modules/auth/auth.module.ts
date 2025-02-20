import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from '../user/user.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { PassportModule } from '@nestjs/passport'
import { RequestContextModule } from 'nestjs-request-context'
import { UserRolePermission } from '../../entities/user-role-permission.entity'
import { UserRolePermissionService } from '../user-role-permission/user-role-permission.service'
import { PermissionService } from '../permission/permission.service'
import { Permission } from '../../entities/permission.entity'
import { AuthService } from './auth.service'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, UserRolePermission, Permission]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT
    }),
    RequestContextModule
  ],
  providers: [JwtAuthGuard, JwtStrategy, UserService, UserRolePermissionService, PermissionService, AuthService],
  controllers: [AuthController],
  exports: [
    JwtStrategy,
  ]
})
export class AuthModule {}
