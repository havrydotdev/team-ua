import { Module } from '@nestjs/common';
import { I18nOptions, I18nModule as NestI18n } from 'nestjs-i18n';
import { join } from 'path';

import ApiConfigService from '../config/api-config.service';

@Module({
  imports: [
    NestI18n.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService): I18nOptions => ({
        fallbackLanguage: config.fallbackLanguage,
        loaderOptions: {
          path: join(__dirname, '../../i18n/'),
          watch: true,
        },
        logging: false,
        typesOutputPath: config.isProd
          ? undefined
          : join(__dirname, '../../../src/generated/i18n.generated.ts'),
      }),
    }),
  ],
})
export class I18nModule {}
