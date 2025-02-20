import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRolePermission } from '../../entities/user-role-permission.entity';
import { CheckPermissionUser } from '../../dto/user-role-permission.dto';

@Injectable()
export class UserRolePermissionService extends BaseService<UserRolePermission> {
  constructor(
    @InjectRepository(UserRolePermission)
    public repository: Repository<UserRolePermission>,
  ) {
    super(repository);
  }

  async checkPermissionOfUser(request: CheckPermissionUser) {
    const response = await this.repository.createQueryBuilder('user_role_permission')
      .leftJoinAndSelect('user_role_permission.user', 'user')
      .leftJoinAndSelect('user_role_permission.permission', 'permission')
      .where('user_role_permission.permission_id = (SELECT id FROM permissions WHERE path_api = :pathApi)', { pathApi: request.pathApi })
      .andWhere('user_role_permission.user_id = :userId', { userId: request.userId }).getOne();
    if (response) {
      return true;
    }

    return false;
  }
}
