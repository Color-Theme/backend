import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Query,
  Res,
  BadRequestException, UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { PhotoService } from './photo.service'
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger'
import { ListImageDto, UploadFileDto } from '../../dto/create-file.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload File' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Upload image file',
    schema: {
      type: 'object',
      properties: {
        categoryName: { type: 'string' },
        file: { type: 'string', format: 'binary' }
      }
    }
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body: UploadFileDto) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File không được để trống');
    }
    const fileUrl = await this.photoService.uploadFile(body, file)
    return { fileUrl }
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async listImage(@Query()  params :ListImageDto) {
    return await this.photoService.listImage(params)
  }

  @Post('upload-image-folder')
  async uploadImageFolder() {
    return await this.photoService.uploadImageFolder()
  }
}
