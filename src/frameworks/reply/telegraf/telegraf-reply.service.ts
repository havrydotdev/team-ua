import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { InjectBot } from 'nestjs-telegraf';
import { IReplyService } from 'src/core/abstracts';
import { InjectCache } from 'src/core/decorators';
import { User } from 'src/core/entities';
import { getProfileCacheKey } from 'src/core/utils';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  Extra,
  Language,
  MessageContext,
  MsgKey,
  PhotoExtra,
} from 'src/types/telegraf';
import { Telegraf } from 'telegraf';

// TODO: don't use telegraf context but user entity
@Injectable()
class TelegrafReplyService extends IReplyService {
  constructor(
    protected readonly i18n: I18nService<I18nTranslations>,
    @InjectBot() private bot: Telegraf<MessageContext>,
    @InjectCache() private readonly cache: Cache,
  ) {
    super(i18n);
  }

  async reply(
    ctx: MessageContext,
    msgCode: MsgKey,
    extra?: Extra,
  ): Promise<void> {
    const user = await this.cache.get<User>(getProfileCacheKey(ctx.chat.id));

    await this.sendMsgToChat(
      ctx.chat.id,
      this.translate(msgCode, user.lang ?? Language.UA, (extra ?? {}).i18nArgs),
      extra,
    );
  }

  async sendMsgToChat(chatId: number, msg: string, args?: Extra) {
    await this.bot.telegram.sendMessage(chatId, msg, args);
  }

  async sendMsgToChatI18n(
    chatId: number,
    msgCode: MsgKey,
    args?: Extra,
  ): Promise<void> {
    const user = await this.cache.get<User>(getProfileCacheKey(chatId));

    await this.sendMsgToChat(
      chatId,
      this.translate(msgCode, user.lang ?? Language.UA, (args ?? {}).i18nArgs),
      args,
    );
  }

  async sendPhotoToChat(chatId: number, photo: string, args?: PhotoExtra) {
    await this.bot.telegram.sendPhoto(chatId, photo, args);
  }
}

export { TelegrafReplyService };
