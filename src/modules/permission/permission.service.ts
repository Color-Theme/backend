import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Permission } from '../../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    public repository: Repository<Permission>,
  ) {
    super(repository);
  }

  async listPermission() {
    const queryBuilder = this.repository.createQueryBuilder('permissions');
    return await queryBuilder
      .select('permissions.module', 'module')
      .addSelect(
        `
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', permissions.id,
          'name', permissions.name, 
          'description', permissions.description,
          'pathApi', permissions.pathApi,
          'method', permissions.method
        )
      )`,
        'permissions',
      )
      .groupBy('permissions.module')
      .getRawMany();
  }
}
