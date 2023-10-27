import { Action, Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { CHANGE_LANG_WIZARD_ID } from 'src/core/constants';
import { getCaption } from 'src/core/utils';
import { MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Update()
export class AppUpdate {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  @Start()
  async onStart(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    if (!ctx.session.user.profile) {
      await this.replyUseCases.replyI18n(ctx, 'messages.start');

      await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);

      return;
    }

    return 'messages.start';
  }

  @Action('language')
  @Command('language')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onLanguage(@Ctx() ctx: MessageContext): Promise<void> {
    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
  }

  @Action('me')
  @Command('me')
  async onMe(@Ctx() ctx: MessageContext) {
    await ctx.replyWithPhoto(
      { url: ctx.session.user.profile.file.url },
      {
        caption: getCaption(ctx.session.user.profile),
      },
    );
  }

  @Help()
  @Action('help')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onHelp(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    return 'messages.help';
  }

  @Command('error')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onError(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    throw new Error('Test error');
  }
}
