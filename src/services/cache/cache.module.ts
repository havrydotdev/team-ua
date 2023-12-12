import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

import ApiConfigService from '../config/api-config.service';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ApiConfigService],
      isGlobal: true,
      useFactory: async (config: ApiConfigService) => ({
        store: redisStore as unknown as CacheStore,
        ttl: 24 * 60 * 60, // 1 day
        url: config.redisUrl,
      }),
    }),
  ],
})
export class ApiCacheModule {}
