import { Module } from '@nestjs/common'
import { PhotoService } from './photo.service'
import { PhotoController } from './photo.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from '../../entities/category.entity'
import { Photo } from '../../entities/photo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category,Photo])],
  controllers: [PhotoController],
  providers: [PhotoService]
})
export class PhotoModule {}
