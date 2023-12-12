import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Language } from 'src/types';
import { Telegraf } from 'telegraf';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export default class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get botToken(): string {
    return this.configService.get<string>('TELEGRAM_BOT_TOKEN');
  }

  get fallbackLanguage(): Language {
    return this.configService.get('FALLBACK_LANGUAGE');
  }

  get isProd(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  get isWebhooksEnabled(): boolean {
    return this.isProd && this.useWebhooksInProd;
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL');
  }

  get telegrafLaunchOptions(): Telegraf.LaunchOptions {
    return {
      webhook: this.isWebhooksEnabled
        ? {
            domain: this.webhookDomain,
            path: this.webhookCallbackPath,
            port: this.webhookPort,
          }
        : undefined,
    };
  }

  get typeOrmConfig(): DataSourceOptions {
    return {
      database: this.configService.get<string>('DB_NAME'),
      entities: [__dirname + '../../../core/entities/*{.js,.ts}'],
      host: this.configService.get<string>('DB_HOST'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: this.configService.get<number>('DB_PORT'),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
      type: 'postgres',
      username: this.configService.get<string>('DB_USERNAME'),
    };
  }

  get useWebhooksInProd(): boolean {
    return this.configService.get<boolean>('USE_WEBHOOKS_IN_PROD');
  }

  get webhookCallbackPath(): string {
    return this.configService.get<string>('WEBHOOK_CALLBACK_PATH');
  }

  get webhookDomain(): string {
    return this.configService.get<string>('WEBHOOK_DOMAIN');
  }

  get webhookPort(): number {
    return this.configService.get<number>('WEBHOOK_PORT');
  }
}
