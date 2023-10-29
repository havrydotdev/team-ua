import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQLite } from '@telegraf/session/sqlite';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService): TelegrafModuleOptions => {
        const store = SQLite({
          filename: './dev.db',
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
