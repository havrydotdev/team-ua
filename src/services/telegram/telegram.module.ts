import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@telegraf/session/redis';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const store = Redis({
          url: configService.get<string>('REDIS_URL'),
        });

        return {
          middlewares: [session({ store })],
          token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        };
      },
    }),
  ],
})
export class TelegramModule {}
