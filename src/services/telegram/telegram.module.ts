import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Postgres } from '@telegraf/session/pg';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const store = Postgres({
          user: configService.get<string>('DB_USERNAME'),
          port: parseInt(configService.get<string>('DB_PORT')),
          host: configService.get<string>('DB_HOST'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        });

        return {
          token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
          middlewares: [session({ store })],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class TelegramModule {}
