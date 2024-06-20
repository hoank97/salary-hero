import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';
import { join } from 'path';
config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_CORE_HOST_CONTAINER,
  port: +process.env.DB_CORE_PORT_CONTAINER,
  username: process.env.DB_CORE_USERNAME,
  password: process.env.DB_CORE_PASSWORD,
  database: process.env.DB_CORE_DATABASE_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
  synchronize: true,
  subscribers: [__dirname + '/src/subscribers/**/*.subscribers.{js,ts}'],
};
