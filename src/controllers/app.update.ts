import { Command, Ctx, Hears, Help, Start, Update } from 'nestjs-telegraf';
import { Context } from 'src/core';
import { Language } from 'src/core/enums/languages.enum';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { Message } from 'telegraf/typings/core/types/typegram';

@Update()
export class AppUpdate {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    // if user does not exist in session, create it
    if (!ctx.session.user) {
      ctx.session.user = await this.userUseCases.create({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
      });
    }

    await this.replyUseCases.start(ctx);
  }

  @Hears(/🇺🇦|🇬🇧|🇷🇺/)
  async onUa(@Ctx() ctx: Context) {
    // convert ctx.message to Message.TextMessage so we can access text property
    switch ((ctx.message as Message.TextMessage).text) {
      case '🇺🇦':
        ctx.session.lang = Language.UA;
        break;
      case '🇬🇧':
        ctx.session.lang = Language.EN;
        break;
      case '🇷🇺':
        ctx.session.lang = Language.RU;
        break;
    }

    await this.replyUseCases.langChanged(ctx);
  }

  @Command('language')
  async onLanguage(@Ctx() ctx: Context) {
    await this.replyUseCases.updateLanguage(ctx);
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await this.replyUseCases.help(ctx);
  }
}
