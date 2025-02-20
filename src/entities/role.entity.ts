import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;
}
