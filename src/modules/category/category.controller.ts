import {
  Controller, Post, Put, Get, Param, Body, ParseIntPipe, UseGuards
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Put(':uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update category by uuid' })
  async updateCategory(
    @Param('uuid') uuid: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return await this.categoryService.updateCategory(uuid, updateCategoryDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get category detail by uuid' })
  async getCategoryById(@Param('uuid') uuid: string) {
    return await this.categoryService.getCategoryById(uuid);
  }
}
