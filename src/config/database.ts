import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: `${process.env.MYSQL_HOST}`,
  port: `${process.env.MYSQL_PORT}`,
  username: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASS}`,
  database: `${process.env.MYSQL_DB}`,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'dev',
  logging: process.env.NODE_ENV === 'dev',
  migrationsTableName: 'migration',
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
