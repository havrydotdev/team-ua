import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { CHANGE_LANG_WIZARD_ID } from 'src/core/constants';
import { Language } from 'src/core/enums';
import { Extra } from 'src/core/types';
import { getSelectLangMarkup } from 'src/core/utils';
import { MsgKey, WizardContext } from 'src/types';

// TODO: do not hard-code languages
@Wizard(CHANGE_LANG_WIZARD_ID)
export class ChangeLangWizard {
  @WizardStep(1)
  onEnter(@Ctx() ctx: WizardContext): [MsgKey, Extra] {
    ctx.wizard.next();

    return ['messages.select_lang', { reply_markup: getSelectLangMarkup() }];
  }

  @On('text')
  @WizardStep(2)
  async onLang(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey> {
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

    return 'messages.lang_changed';
  }
}
