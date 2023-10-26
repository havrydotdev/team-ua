import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CHANGE_LANG_WIZARD_ID,
  NEXT_WIZARD_ID,
  REGISTER_WIZARD_ID,
} from 'src/core/constants';
import { Language } from 'src/core/enums';
import { Extra } from 'src/core/types';
import { getSelectLangMarkup } from 'src/core/utils';
import { MsgKey, MsgWithExtra, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Markup } from 'telegraf';

@Wizard(CHANGE_LANG_WIZARD_ID)
export class ChangeLangWizard {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  @WizardStep(1)
  onEnter(@Ctx() ctx: WizardContext): [MsgKey, Extra] {
    ctx.wizard.next();

    return [
      ctx.session.user.profile
        ? 'messages.update_lang'
        : 'messages.select_lang',
      { reply_markup: getSelectLangMarkup() },
    ];
  }

  @On('text')
  @WizardStep(2)
  async onLang(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<MsgWithExtra | MsgKey> {
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
      default:
        return 'messages.invalid_lang';
    }

    await ctx.scene.leave();

    if (!ctx.session.user.profile) {
      await this.replyUseCases.replyI18n(ctx, 'messages.lang_changed');

      await ctx.scene.enter(REGISTER_WIZARD_ID);
      return;
    }

    await this.replyUseCases.replyI18n(ctx, 'messages.lang_changed', {
      reply_markup: Markup.removeKeyboard().reply_markup,
    });
    await ctx.scene.enter(NEXT_WIZARD_ID);

    return;
  }
}
