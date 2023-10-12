import { Injectable } from '@nestjs/common';
import { Context } from 'src/core';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class ReplyUseCases {
  private readonly selectLanguageMarkup: ReplyKeyboardMarkup;

  constructor(private readonly replyService: IReplyService) {
    this.selectLanguageMarkup = Markup.keyboard([
      [
        Markup.button.callback('🇺🇦', 'lang_ua'),
        Markup.button.callback('🇬🇧', 'lang_en'),
        Markup.button.callback('🇷🇺', 'lang_ru'),
      ],
    ]).reply_markup;

    this.selectLanguageMarkup.resize_keyboard = true;
    this.selectLanguageMarkup.one_time_keyboard = true;
  }

  async start(ctx: Context) {
    this.hello(ctx);
    this.selectLanguage(ctx);
  }

  async hello(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.start');
  }

  async selectLanguage(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.select_lang', {
      reply_markup: this.selectLanguageMarkup,
    });
  }

  async updateLanguage(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.update_lang', {
      reply_markup: this.selectLanguageMarkup,
    });
  }

  async langChanged(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.lang_changed');
  }

  async help(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.help');
  }
}
