import {
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export class BaseEntity {
  @Column({ name: 'uuid', type: 'uuid', generated: 'uuid', unique: true })
  uuid: string;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
