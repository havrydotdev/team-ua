import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Extra, I18nArgs, Language, PhotoExtra } from 'src/types';
import { Context } from 'telegraf';

abstract class IReplyService {
  constructor(protected readonly i18n: I18nService<I18nTranslations>) {}

  public translate(
    key: PathImpl2<I18nTranslations>,
    lang: Language,
    args?: I18nArgs,
  ): string {
    return this.i18n.t(key, {
      args,
      lang,
    });
  }

  abstract reply(
    ctx: Context,
    msgCode: PathImpl2<I18nTranslations>,
    args?: Extra,
  ): Promise<void>;

  abstract sendMsgToChat(
    chatId: number,
    msg: string,
    args?: Extra,
  ): Promise<void>;

  abstract sendMsgToChatI18n(
    chatId: number,
    msgCode: PathImpl2<I18nTranslations>,
    args?: Extra,
  ): Promise<void>;

  abstract sendPhotoToChat(
    chatId: number,
    fileId: string,
    args?: PhotoExtra,
  ): Promise<void>;
}

export { IReplyService };
