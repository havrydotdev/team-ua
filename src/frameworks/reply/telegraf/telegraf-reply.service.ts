import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { IReplyService } from 'src/core/abstracts';
import { Extra } from 'src/core/types';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { MessageContext } from 'src/types/telegraf';
import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

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
    await ctx.reply(this.translate(msgCode, ctx.session.lang), extra);
  }

  async getMainMenuMarkup(ctx: MessageContext): Promise<InlineKeyboardMarkup> {
    const reply_markup = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          this.translate('buttons.profile', ctx.session.lang),
          'me',
        ),
        Markup.button.callback(
          this.translate('buttons.change_lang', ctx.session.lang),
          'language',
        ),
        Markup.button.callback(
          this.translate('buttons.help', ctx.session.lang),
          'help',
        ),
      ],
      [
        Markup.button.callback(
          this.translate('buttons.partner', ctx.session.lang),
          'partnership',
        ),
      ],
    ]).reply_markup;

    return reply_markup;
  }
}

export { TelegrafReplyService };
