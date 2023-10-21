import {
  Command,
  Ctx,
  Hears,
  Help,
  Message,
  Start,
  Update,
} from 'nestjs-telegraf';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { Language } from 'src/core/enums/languages.enum';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { MessageContext } from 'src/types/telegraf';

@Update()
export class AppUpdate {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: MessageContext) {
    if (!ctx.session.user) {
      // if user does not exist in session, create it
      ctx.session.user = await this.userUseCases.create({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
      });
    }

    await this.replyUseCases.startCommandMessage(ctx);
  }

  @Hears(/🇺🇦|🇬🇧|🇷🇺/)
  async onLang(@Ctx() ctx: MessageContext, @Message() msg: { text: string }) {
    // convert ctx.message to Message.TextMessage so we can access text property
    switch (msg.text) {
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

    await this.replyUseCases.languageChanged(ctx);

    if (!ctx.session.user || !ctx.session.user.profile) {
      // if profile does not exist, create it
      await this.replyUseCases.newUser(ctx);

      await ctx.scene.enter(REGISTER_WIZARD_ID);
    }
  }

  @Command('language')
  async onLanguage(@Ctx() ctx: MessageContext) {
    await this.replyUseCases.updateLanguage(ctx);
  }

  @Command('me')
  async onMe(@Ctx() ctx: MessageContext) {
    console.log(ctx.session.user);
    await ctx.replyWithPhoto(
      { url: ctx.session.user.profile.file.url },
      { caption: ctx.session.user.profile.name },
    );
  }

  @Help()
  async onHelp(@Ctx() ctx: MessageContext) {
    await this.replyUseCases.helpCommandMessage(ctx);
  }
}
