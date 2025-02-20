import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'permissions' })
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { nullable: false, name: 'path_api', unique: true })
  pathApi: string;

  @Column('varchar', { nullable: true })
  method: string;

  @Column('varchar', { nullable: true })
  module: string;
}
