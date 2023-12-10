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

        console.log(configService.get<string>('NODE_ENV'));

        return {
          launchOptions:
            configService.get<string>('NODE_ENV') === 'production'
              ? {
                  webhook: {
                    domain: configService.get<string>('WEBHOOK_DOMAIN'),
                    path: configService.get<string>('WEBHOOK_CALLBACK_PATH'),
                    port: configService.get<number>('WEBHOOK_PORT'),
                  },
                }
              : undefined,
          middlewares: [session({ store })],
          token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        };
      },
    }),
  ],
})
export class TelegramModule {}
