import { Module } from '@nestjs/common'
import { Category } from '../../entities/category.entity'
import { CategoryService } from './category.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryController } from './category.controller'
import { PhotoService } from '../photo/photo.service'
import { Photo } from '../../entities/photo.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category,Photo])],
  providers: [CategoryService, PhotoService],
  controllers: [CategoryController]
})
export class CategoryModule {}
