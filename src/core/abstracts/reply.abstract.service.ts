import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Context } from 'telegraf';
import { Language } from '../enums/languages.enum';
import { Extra } from '../types';

abstract class IReplyService {
  constructor(protected readonly i18n: I18nService<I18nTranslations>) {}

  abstract reply(
    ctx: Context,
    msgCode: PathImpl2<I18nTranslations>,
    args?: Extra,
  ): Promise<void>;

  protected translate(
    key: PathImpl2<I18nTranslations>,
    lang: Language,
  ): string {
    return this.i18n.t(key, {
      lang,
    });
  }
}

export { IReplyService };
