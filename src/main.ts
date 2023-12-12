import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { AppModule } from './app.module';
import ApiConfigService from './services/config/api-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ApiConfigService>(ApiConfigService);

  if (configService.isWebhooksEnabled) {
    const bot = app.get<Telegraf>(getBotToken());
    const webhookCallbackPath = configService.webhookCallbackPath;

    app.use(bot.webhookCallback(webhookCallbackPath));
  }
  app.init();
}
bootstrap();
