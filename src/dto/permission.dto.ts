import { PageOptionsDto } from './pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches } from 'class-validator';

export class PermissionFilterDTO extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Mail' })
  @IsOptional()
  @IsEmail()
  mail: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/)
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ description: 'Tên' })
  @IsOptional()
  fullName: string;
}