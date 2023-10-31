import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Context } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { Language } from '../enums/languages.enum';
import { Extra, I18nArgs } from '../types';

abstract class IReplyService {
  constructor(protected readonly i18n: I18nService<I18nTranslations>) {}

  abstract reply(
    ctx: Context,
    msgCode: PathImpl2<I18nTranslations>,
    args?: Extra,
  ): Promise<void>;

  abstract getMainMenuMarkup(ctx: Context): Promise<InlineKeyboardMarkup>;

  protected translate(
    key: PathImpl2<I18nTranslations>,
    lang: Language,
    args?: I18nArgs,
  ): string {
    return this.i18n.t(key, {
      lang,
      args,
    });
  }
}

export { IReplyService };
