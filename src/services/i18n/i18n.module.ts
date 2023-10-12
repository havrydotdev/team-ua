import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nOptions, I18nModule as NestI18n } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    NestI18n.forRootAsync({
      useFactory: (configService: ConfigService): I18nOptions => ({
        fallbackLanguage:
          configService.get<string>('FALLBACK_LANGUAGE') ?? 'en',
        loaderOptions: {
          path: join(__dirname, '../../i18n/'),
          watch: true,
        },
        typesOutputPath: join(
          __dirname,
          '../../../src/generated/i18n.generated.ts',
        ),
        disableMiddleware: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class I18nModule {}
