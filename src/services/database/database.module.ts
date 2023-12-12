import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import ApiConfigService from '../config/api-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory(config: ApiConfigService): DataSourceOptions {
        return config.typeOrmConfig;
      },
    }),
  ],
})
export class DatabaseModule {}
