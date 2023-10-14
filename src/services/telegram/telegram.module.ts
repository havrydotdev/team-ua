import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { SQLite } from '@telegraf/session/sqlite';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const store = SQLite({
          filename: './dev.sqlite',
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
