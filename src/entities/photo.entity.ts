import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Category } from './category.entity'
import { BaseEntity } from './base.entity'

@Entity({ name: 'photos' })
export class Photo extends BaseEntity {
  @Column({ name: 'title', length: 255 })
  title: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string

  @Column({ name: 'path' })
  path: string

  @Column({ name: 'webp_path' })
  webp_path: string

  @Column({ name: 'url', type: 'text' })
  url: string;

  @Column({ name: 'webp_url', type: 'text' })
  webp_url: string;

  @Column({ name: 'bucket_name' })
  bucketName: string

  @Column({ name: 'views', default: 0 })
  views: number

  @Column({ name: 'likes', default: 0 })
  likes: number

  @Column({ name: 'downloads', default: 0 })
  downloads: number

  @Column({ name: 'pre_url_expires_at', type: 'timestamp', nullable: true })
  preUrlExpiresAt: Date | null

  @Column({ name: 'pre_url_webp_expires_at', type: 'timestamp', nullable: true })
  preUrlWebpExpiresAt: Date | null

  @ManyToOne(() => Category, (category) => category.photos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
