import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { IReplyService } from 'src/core/abstracts';
import { Extra } from 'src/core/types';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { MessageContext } from 'src/types/telegraf';

@Injectable()
class TelegrafReplyService extends IReplyService {
  constructor(protected readonly i18n: I18nService<I18nTranslations>) {
    super(i18n);
  }

  async reply(
    ctx: MessageContext,
    msgCode: PathImpl2<I18nTranslations>,
    extra?: Extra,
  ): Promise<void> {
    await ctx.telegram.sendMessage(
      ctx.from.id,
      this.translate(msgCode, ctx.session.lang, (extra ?? {}).i18nArgs),
      extra,
    );
  }
}

export { TelegrafReplyService };
