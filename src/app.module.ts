import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './services/telegram/telegram.module';
import { AppUpdate } from './updates';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
  ],
  controllers: [],
  providers: [AppUpdate],
})
export class AppModule {}
