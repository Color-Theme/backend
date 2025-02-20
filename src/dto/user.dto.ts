import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { VALIDATION } from '../core/validation/validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from './pagination.dto';
import { Transform } from 'class-transformer';
import { UserStatusEnum } from '../core/base/base.enum';

export class RegisterUserDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: VALIDATION.PASSWORD.MESSAGE_ERROR.INVALID_PASSWORD,
  })
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Mail sai định dạng' })
  mail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, {
    message: 'Số điện thoại không phù hợp',
  })
  phone: string;

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  @IsNotEmpty()
  status: UserStatusEnum;
}

export class UserFilterDTO extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Tìm kiêm' })
  @IsOptional()
  search: string;
}

export class GetUserByFilter {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'ID must be number' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  id: number;
}

export class UpdateUserDTO {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail({}, { message: 'Mail sai định dạng' })
  mail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, {
    message: 'Số điện thoại không phù hợp',
  })
  phone: string;

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  @IsOptional()
  status: UserStatusEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: VALIDATION.PASSWORD.MESSAGE_ERROR.INVALID_PASSWORD,
  })
  password: string

}
