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
import { MessageContext, MsgKey } from 'src/types';
import { Extra } from 'src/core/types';
import { getSelectLangMarkup } from 'src/core/utils';

@Update()
export class AppUpdate {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    if (!ctx.session.user) {
      // if user does not exist in session, create it
      ctx.session.user = await this.userUseCases.create({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
      });

      await ctx.scene.enter(REGISTER_WIZARD_ID);
    }

    return 'messages.start';
  }

  @Hears(/🇺🇦|🇬🇧|🇷🇺/)
  async onLang(
    @Ctx() ctx: MessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey> {
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

    return 'messages.lang_changed';
  }

  @Command('language')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onLanguage(@Ctx() ctx: MessageContext): Promise<[MsgKey, Extra]> {
    return ['messages.update_lang', { reply_markup: getSelectLangMarkup() }];
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onHelp(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    return 'messages.help';
  }
}
