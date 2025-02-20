import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { BaseService } from '../../core/base/base.service';
import {
  GetUserByFilter,
  UpdateUserDTO,
  UserFilterDTO,
} from '../../dto/user.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '../../dto/pagination.dto';
import { Permission } from '../../entities/permission.entity';
import { MessageEnum } from '../../core/base/base.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
    @InjectRepository(Permission)
    public permissionRepository: Repository<Permission>,
  ) {
    super(repository);
  }

  async Pagination(
    filter: UserFilterDTO,
    pagination: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const selectField = [
      'id',
      'uuid',
      'full_name AS fullName',
      'first_name AS firstName',
      'last_name AS lastName',
      'username',
      'status',
      'mail',
      'phone',
    ];

    const queryBuilder = this.repository.createQueryBuilder(User.name);

    if (filter.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`${User.name}.username LIKE :search`, {
            search: `%${filter.search}%`,
          })
            .orWhere(`${User.name}.full_name LIKE :search`, {
              search: `%${filter.search}%`,
            })
            .orWhere(`${User.name}.phone LIKE :search`, {
              search: `%${filter.search}%`,
            });
        }),
      );
    }

    queryBuilder
      .select(selectField)
      .orderBy(`${User.name}.created_at`, pagination.order)
      .skip(pagination.skip)
      .take(pagination.take);

    const itemCount = await queryBuilder.getCount();
    const raw = await queryBuilder.getRawMany();

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pagination,
      itemCount,
    });

    return new PageDto(raw, pageMetaDto);
  }

  async getUser(uuid: string) {
    const queryBuilder = this.permissionRepository
      .createQueryBuilder('p')
      .leftJoin('user_role_permissions', 'urp', 'urp.permission_id = p.id')
      .leftJoin('urp.user', 'u')
      .leftJoin('urp.role', 'r')
      .select([
        'u.id AS id',
        'u.username AS username',
        'u.full_name AS fullName',
        'u.mail AS mail',
        'u.phone AS phone',
        'r.name AS roleName',
        'r.description AS roleDescription',
      ])
      .addSelect(
        `JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'module', p.module,
              'name', p.name,
              'pathApi', p.path_api,
              'method', p.method
          )
      )`,
        'permissions',
      )
      .where('u.uuid = :uuid', { uuid: uuid })
      .groupBy('u.id')
      .addGroupBy('r.id');

    const user = await queryBuilder.getRawOne();
    if (!user) {
      throw new BadRequestException(MessageEnum.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(request: UpdateUserDTO) {
    const user = await this.repository.findOne({
      where: { uuid: request.uuid },
    });

    if (!user) {
      throw new NotFoundException(MessageEnum.USER_NOT_FOUND);
    }
    if (request.mail !== user.mail) {
      const existedMail = await this.repository.findBy({ mail: request.mail });
      if (existedMail) {
        throw new BadRequestException(MessageEnum.MAIL_DUPLICATE);
      }
    }

    if (request.phone !== user.phone) {
      const existedPhone = await this.repository.findBy({
        phone: request.phone,
      });
      if (existedPhone) {
        throw new BadRequestException(MessageEnum.PHONE_DUPLICATE);
      }
    }

    if (request.password) {
      const hashPassword = await bcrypt.hash(request.password, 5);
      user.password = hashPassword
    }

    Object.assign(user, request);
    await this.repository.save(user)
    return  MessageEnum.UPDATE_SUCCESS;
  }
}
