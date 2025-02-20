import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerConfig } from './core/swagger/swagger';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import * as bodyParser from 'body-parser';
import * as process from 'node:process'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(Object.values(validationErrors[0].constraints)[0]);
      },
    }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: [process.env.WEB_URL],
    methods: ['GET' , 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key' , 'Authorization']
  });
  app.setGlobalPrefix(`${process.env.SERVER_NAME}/v1`);
  SwaggerConfig(app, process.env.SERVER_NAME);
  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
