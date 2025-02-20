import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../entities/permission.entity';
// import { ApiPathsService } from '../api-path/api-path.service';
import { DiscoveryService } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionService, DiscoveryService],
  controllers: [PermissionController],
})
export class PermissionModule {}
