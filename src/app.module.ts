import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import typeorm from './config/database';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { PhotoModule } from './modules/photo/photo.module';
import { CategoryModule } from './modules/category/category.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    PhotoModule,
    CategoryModule
  ],
  providers:[
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
