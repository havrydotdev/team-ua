import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService): DataSourceOptions {
        return {
          database: config.get<string>('DB_NAME'),
          entities: [__dirname + '../../../core/entities/*{.js,.ts}'],
          host: config.get<string>('DB_HOST'),
          logging: Boolean(config.get<string>('DB_LOGGING')),
          password: config.get<string>('DB_PASSWORD'),
          port: parseInt(config.get<string>('DB_PORT')),
          synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
          type: config.get<string>('DB_TYPE') as 'better-sqlite3' | 'postgres',
          username: config.get<string>('DB_USERNAME'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
