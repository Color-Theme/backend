import { Injectable } from '@nestjs/common';
import { DeleteResult, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from '../../dto/pagination.dto';

type FilterType = Record<any, any>;

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(public repository: Repository<T>) {}

  async getById(id: number, selectFields: string[] = []): Promise<T> {
    const query: any = { id: id };
    return this.repository.findOne({ where: query, select: selectFields });
  }

  async getOne(query: any): Promise<T> {
    return this.repository.findOne({ where: query });
  }

  async findOneBy(query: any): Promise<T> {
    return this.repository.findOneBy(query);
  }

  async getAllBy(query: any): Promise<T[]> {
    return this.repository.findBy(query);
  }

  async updateById(id: string, data: any): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  async update(condition: any, data: any): Promise<UpdateResult> {
    return this.repository.update({ ...condition }, data);
  }

  async create(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  async delete(condition: any): Promise<DeleteResult> {
    return this.repository.softDelete({ ...condition });
  }

  async pagination<T>(
    repository: Repository<T>,
    filter: FilterType,
    pagination: PageOptionsDto,
    alias: string = 'entity',
    selectFields: string[] = [],
  ): Promise<PageDto<T>> {
    const queryBuilder = repository.createQueryBuilder(alias);

    if (selectFields.length > 0) {
      const selectAliasFields = selectFields.map(
        (field) => `${alias}.${field}`,
      );
      queryBuilder.select(selectAliasFields);
    }
    const paginationKeys = [`take`, `order`, `page`];

    Object.keys(filter).forEach((key) => {
      if (
        filter[key] &&
        !paginationKeys.includes(key) &&
        typeof filter[key] == 'string'
      ) {
        queryBuilder.orWhere(`${alias}.${key} LIKE "%${filter[key]}%"`);
      } else if (
        filter[key] &&
        !paginationKeys.includes(key) &&
        typeof filter[key] == 'number'
      ) {
        queryBuilder.orWhere(`${alias}.${key} = ${filter[key]}`);
      }
    });

    queryBuilder
      .orderBy(`${alias}.created_at`, pagination.order)
      .skip(pagination.skip)
      .take(pagination.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pagination,
      itemCount,
    });

    return new PageDto(entities, pageMetaDto);
  }
}
