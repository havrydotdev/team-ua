import { Injectable } from '@nestjs/common';
import { PathImpl2 } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { InjectBot } from 'nestjs-telegraf';
import { IReplyService } from 'src/core/abstracts';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  Extra,
  Language,
  MessageContext,
  PhotoExtra,
} from 'src/types/telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
class TelegrafReplyService extends IReplyService {
  constructor(
    protected readonly i18n: I18nService<I18nTranslations>,
    @InjectBot() private bot: Telegraf<MessageContext>,
  ) {
    super(i18n);
  }

  async reply(
    ctx: MessageContext,
    msgCode: PathImpl2<I18nTranslations>,
    extra?: Extra,
  ): Promise<void> {
    await this.sendMsgToChat(
      ctx.chat.id,
      this.translate(
        msgCode,
        ctx.session.lang ?? Language.UA,
        (extra ?? {}).i18nArgs,
      ),
      extra,
    );
  }

  async sendMsgToChat(chatId: number, msg: string, args?: Extra) {
    await this.bot.telegram.sendMessage(chatId, msg, args);
  }

  async sendPhotoToChat(chatId: number, photo: string, args?: PhotoExtra) {
    await this.bot.telegram.sendPhoto(chatId, photo, args);
  }
}

export { TelegrafReplyService };
