import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(
    private readonly permissionService : PermissionService
  ) {}

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async ListPermission(
  ) {
    return await this.permissionService.listPermission();
  }
}
