import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { Game } from 'src/core';

@Injectable()
export class ReplyUseCases {
  private readonly selectLanguageMarkup: ReplyKeyboardMarkup;

  constructor(private readonly replyService: IReplyService) {
    // create keyboard for selecting language
    this.selectLanguageMarkup = Markup.keyboard([
      [
        Markup.button.callback('🇺🇦', 'lang_ua'),
        Markup.button.callback('🇬🇧', 'lang_en'),
        Markup.button.callback('🇷🇺', 'lang_ru'),
      ],
    ]).reply_markup;

    // resize keyboard to fit screen
    this.selectLanguageMarkup.resize_keyboard = true;

    // hide keyboard after user selects language
    this.selectLanguageMarkup.one_time_keyboard = true;
  }

  async startCommandMessage(ctx: Context) {
    await this.helloMessage(ctx);

    await this.selectLanguage(ctx);
  }

  async helloMessage(ctx: Context) {
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

  async languageChanged(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.lang_changed');
  }

  async newUser(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.new_user');
  }

  async helpCommandMessage(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.help');
  }

  async enterName(ctx: Context) {
    const fullName = `${ctx.from.first_name}`;

    const reply_markup = Markup.keyboard([
      [Markup.button.callback(fullName, fullName)],
    ]).reply_markup;

    // resize keyboard to fit screen
    reply_markup.resize_keyboard = true;

    // hide keyboard after user enters name
    reply_markup.one_time_keyboard = true;

    await this.replyService.reply(ctx, 'messages.enter_name', {
      reply_markup,
    });
  }

  async enterAge(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.enter_age');
  }

  async invalidAge(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.invalid_age');
  }

  async sendLocation(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.send_location');
  }

  async sendPicture(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.send_picture', {
      reply_markup: Markup.removeKeyboard().reply_markup,
    });
  }

  async sendGames(ctx: Context, games: Game[]) {
    const reply_markup = Markup.keyboard(
      games.map((game) => Markup.button.callback(game.title, game.title)),
    ).reply_markup;

    reply_markup.resize_keyboard = true;

    await this.replyService.reply(ctx, 'messages.send_games', {
      reply_markup,
    });
  }

  async invalidGame(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.invalid_game');
  }

  async gameAdded(ctx: Context) {
    await this.replyService.reply(ctx, 'messages.game_added');
  }
}
