import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { Keyboards, NEXT_WIZARD_ID } from 'src/core/constants';
import { HandlerResponse, MessageContext } from 'src/types';

@Wizard(NEXT_WIZARD_ID)
export class NextActionWizard {
  @WizardStep(1)
  async onEnter(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    await ctx.scene.leave();
    return [
      'messages.next_action',
      {
        reply_markup: Keyboards.mainMenu,
      },
    ];
  }
}
