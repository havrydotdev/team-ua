import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

// TODO: add custom config wrapper
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().default('localhost'),
        DB_NAME: Joi.string().default('postgres'),
        DB_PASSWORD: Joi.string().default('password'),
        DB_PORT: Joi.number().default(5432),
        DB_SYNCHRONIZE: Joi.boolean().default(true),
        DB_USERNAME: Joi.string().default('postgres'),
        FALLBACK_LANGUAGE: Joi.string().default('ua'),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
      }),
    }),
  ],
})
export class ApiConfigModule {}
