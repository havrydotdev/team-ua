import { Module } from '@nestjs/common';
import { Redis } from '@telegraf/session/redis';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

import ApiConfigService from '../config/api-config.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService): TelegrafModuleOptions => {
        const store = Redis({
          url: config.redisUrl,
        });

        return {
          launchOptions: config.telegrafLaunchOptions,
          middlewares: [session({ store })],
          token: config.botToken,
        };
      },
    }),
  ],
})
export class TelegramModule {}
