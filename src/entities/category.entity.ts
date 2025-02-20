import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';
import { BaseEntity } from './base.entity';
import slugify from 'slugify';
import { Photo } from './photo.entity'

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({name : "name_vi", unique: true })
  nameVi: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Photo, (photo) => photo.category)
  photos: Photo[];

}
