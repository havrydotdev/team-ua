import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: config.get<string>('DB_TYPE') as 'postgres' | 'better-sqlite3',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USERNAME'),
          logging: Boolean(config.get<string>('DB_LOGGING')),
          port: parseInt(config.get<string>('DB_PORT')),
          host: config.get<string>('DB_HOST'),
          password: config.get<string>('DB_PASSWORD'),
          synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
          entities: [__dirname + '../../../core/entities/*{.js,.ts}'],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
