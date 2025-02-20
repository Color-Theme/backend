import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import * as Minio from 'minio'
import { Readable } from 'typeorm/browser/platform/BrowserPlatformTools'
import * as sharp from 'sharp'
import { ListImageDto, UploadFileDto } from '../../dto/create-file.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../../entities/category.entity'
import { Repository } from 'typeorm'
import { Photo } from '../../entities/photo.entity'
import { PageDto, PageMetaDto } from '../../dto/pagination.dto'

@Injectable()
export class PhotoService {
  private minioClient: Minio.Client
  private logger = new Logger(PhotoService.name)

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>
  ) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_END_POINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    })
  }

  async uploadFile(dto: UploadFileDto, file: Express.Multer.File) {
    const category = await this.categoryRepository.findOne({ where: { uuid: dto.categoryUUID } })
    if (!category) {
      throw new BadRequestException('Không tìm thấy loại ảnh')
    }

    const originalFileName = file.originalname
    const fileName = `${originalFileName}`
    const fileNameWebp = `${originalFileName.replace(/\.[^/.]+$/, '.webp')}`

    const webpBuffer = await sharp(file.buffer).webp({ quality: 1 }).toBuffer()

    const jpgPath = `JPG/${fileName}`
    const webpPath = `WEBP/${fileNameWebp}`

    await Promise.all([
      this.minioClient.putObject(`${category.name}`, jpgPath, file.buffer, undefined, { 'Content-Type': 'image/jpg' }),
      this.minioClient.putObject(`${category.name}`, webpPath, webpBuffer, undefined, { 'Content-Type': 'image/webp' })
    ])
    const expiresOneDay = 60
    const expiresSevenDay = 7 * 24 * 60 * 60
    const [jpgPreUrl, webpPreUrl] = await Promise.all([
      this.minioClient.presignedUrl('GET', category.name, jpgPath, expiresSevenDay),
      this.minioClient.presignedUrl('GET', category.name, webpPath, expiresOneDay)
    ])
    const preUrlWebpExpiresAt = new Date(Date.now() + expiresOneDay * 1000)
    const preUrlExpiresAt = new Date(Date.now() + expiresSevenDay * 1000)
    this.photoRepository.save({
      title: originalFileName,
      description: null,
      url: jpgPreUrl,
      webp_url: webpPreUrl,
      path: jpgPath,
      webp_path: webpPath,
      preUrlExpiresAt: preUrlExpiresAt,
      preUrlWebpExpiresAt: preUrlWebpExpiresAt,
      bucketName: category.slug,
      category: category
    })

    return 'Upload ảnh thành công'
  }

  async createBucket(bucketName: string) {
    console.log({
      endPoint: process.env.MINIO_END_POINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    })
    try {
      if (await this.minioClient.bucketExists(bucketName)) {
        this.logger.log(`✅ Bucket "${bucketName}" already exists`)
        return
      }

      await this.minioClient.makeBucket(bucketName)
      this.logger.log(`🎉 Bucket "${bucketName}" created successfully`)
    } catch (error) {
      this.logger.error(`❌ Failed to create bucket "${bucketName}": ${error.message}`)
      throw new InternalServerErrorException(`Cannot create bucket: ${error.message}`)
    }
  }

  async listImage(params: ListImageDto) {
    const { skip, take, order } = params

    // Lấy danh sách ảnh từ database có pagination
    const [data, itemCount] = await this.photoRepository.findAndCount({
      order: { createdAt: order },
      skip,
      take
    })

    // Tạo thông tin phân trang
    const meta = new PageMetaDto({ pageOptionsDto: params, itemCount })

    return new PageDto(data, meta)
  }
}
