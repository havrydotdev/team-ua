import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  if (configService.get<string>('NODE_ENV') === 'production') {
    const bot = app.get<Telegraf>(getBotToken());
    const webhookCallbackPath = configService.get<string>(
      'WEBHOOK_CALLBACK_PATH',
    );

    app.use(bot.webhookCallback(webhookCallbackPath));
  }
  app.init();
}
bootstrap();
