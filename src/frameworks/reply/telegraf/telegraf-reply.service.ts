import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { Context } from 'src/core';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { Extra } from 'src/core/types';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
class TelegrafReplyService extends IReplyService {
  constructor(protected readonly i18n: I18nService<I18nTranslations>) {
    super(i18n);
  }

  async reply(
    ctx: Context,
    msgCode: PathImpl2<I18nTranslations>,
    extra?: Extra,
  ): Promise<void> {
    await ctx.reply(this.translate(msgCode, ctx.session.lang), extra);
  }
}

export { TelegrafReplyService };
