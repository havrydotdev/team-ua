import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Language } from 'src/types';

import ApiConfigService from './api-config.service';

// TODO: add custom config wrapper
@Global()
@Module({
  exports: [ApiConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_SYNCHRONIZE: Joi.boolean().default(false),
        DB_USERNAME: Joi.string().required(),
        FALLBACK_LANGUAGE: Joi.string().default(Language.UA),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        REDIS_URL: Joi.string().uri().required(),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
        USE_WEBHOOKS_IN_PROD: Joi.boolean().default(false),
        WEBHOOK_CALLBACK_PATH: Joi.string(),
        WEBHOOK_DOMAIN: Joi.string(),
        WEBHOOK_PORT: Joi.number().port().default(443),
      }),
    }),
  ],
  providers: [ApiConfigService],
})
export class ApiConfigModule {}
