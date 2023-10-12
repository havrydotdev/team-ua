import { Ctx, Hears, Help, Start, Update } from 'nestjs-telegraf';
import { Context } from 'src/core';
import { CLEAR_REPLY_MARKUP, START_REPLY_MARKUP } from 'src/core/constants';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class AppUpdate {
  constructor(private readonly userUseCases: UserUseCases) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (ctx.session.user) {
      await ctx.reply('Оберіть мову інтерфейсу бота', {
        reply_markup: START_REPLY_MARKUP,
      });

      return;
    } else {
      const user = await this.userUseCases.create({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
      });

      ctx.session.user = user;

      await ctx.reply('Оберіть мову інтерфейсу бота', {
        reply_markup: START_REPLY_MARKUP,
      });
    }
  }

  @Hears(/🇺🇦|🇬🇧|🇷🇺/)
  async onUa(@Ctx() ctx: Context) {
    switch ((ctx.message as Message.TextMessage).text) {
      case '🇺🇦':
        ctx.session.lang = 'ua';
        break;
      case '🇬🇧':
        ctx.session.lang = 'en';
        break;
      case '🇷🇺':
        ctx.session.lang = 'ru';
        break;
    }

    await ctx.reply('Мову змінено', {
      reply_markup: CLEAR_REPLY_MARKUP,
    });
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('Teammates Bot Help');
  }
}
