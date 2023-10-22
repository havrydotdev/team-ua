import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { CHANGE_LANG_WIZARD_ID, REGISTER_WIZARD_ID } from 'src/core/constants';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { MessageContext, MsgKey } from 'src/types';

@Update()
export class AppUpdate {
  constructor(private readonly userUseCases: UserUseCases) {}

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

  @Command('language')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onLanguage(@Ctx() ctx: MessageContext): Promise<void> {
    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
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
