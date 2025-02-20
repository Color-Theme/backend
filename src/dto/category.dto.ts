import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Nature' })
  @IsNotEmpty({message:"Không được để trống name"})
  @IsString()
  name: string;

  @ApiProperty({ example: 'Thiên nhiên' })
  @IsNotEmpty({message:"Không được để trống nameVi"})
  @IsString()
  nameVi: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Nature', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Thiên nhiên', required: false })
  @IsOptional()
  @IsString()
  nameVi?: string;
}
