import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VALIDATION } from '../core/validation/validation';

export class LoginDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  accessToken: string;
}

export class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: VALIDATION.PASSWORD.MESSAGE_ERROR.INVALID_PASSWORD,
  })
  newPassword: string;
}
