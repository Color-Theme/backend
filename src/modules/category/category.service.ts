import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import slugify from 'slugify'
import { Category } from '../../entities/category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category.dto'
import { PhotoService } from '../photo/photo.service'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private minioService : PhotoService
  ) {}

  // 📌 1. Tạo danh mục mới
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existingNameCategory = await this.categoryRepository.findOne({
      where: { name: dto.name }
    })

    if (existingNameCategory) {
      throw new BadRequestException('Đã tồn tại tên cho loại ảnh')
    }
    const slug = slugify(dto.name, { lower: true, strict: true });
    try {
      await this.minioService.createBucket(slug);
    } catch (error) {
      throw new InternalServerErrorException(`Không thể tạo bucket MinIO: ${error.message}`);
    }

    return await this.categoryRepository.save({
      name: dto.name,
      nameVi: dto.nameVi,
      slug: slug
    })
  }

  // 📌 2. Cập nhật danh mục
  async updateCategory(uuid: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { uuid } })
    if (!category) throw new NotFoundException('Category not found')

    if (dto.name !== category.name) {
      category.name = dto.name
      category.slug = slugify(dto.name, { lower: true, strict: true })
    }
    if (dto.nameVi !== category.nameVi) {
      category.nameVi = dto.nameVi
    }

    return await this.categoryRepository.save(category)
  }

  // 📌 3. Lấy danh sách danh mục
  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find()
  }

  // 📌 4. Lấy danh mục theo ID
  async getCategoryById(uuid: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { uuid } })
    if (!category) throw new NotFoundException('Không tìm thấy loại ảnh')
    return category
  }
}
