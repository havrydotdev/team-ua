import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { MAIN_MENU_MARKUP, NEXT_WIZARD_ID } from 'src/core/constants';
import { MessageContext, MsgWithExtra } from 'src/types';

@Wizard(NEXT_WIZARD_ID)
export class NextActionWizard {
  @WizardStep(1)
  async onEnter(@Ctx() ctx: MessageContext): Promise<MsgWithExtra> {
    await ctx.scene.leave();
    return [
      'messages.next_action',
      {
        reply_markup: MAIN_MENU_MARKUP,
      },
    ];
  }
}
