import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PageOptionsDto } from './pagination.dto'

export class UploadFileDto {
  @ApiProperty({ description: 'Category UUID', example: 'my-category' })
  @IsNotEmpty({ message: 'categoryUUID không được để trống' })
  categoryUUID: string;
}

export class ListImageDto extends PageOptionsDto{

}