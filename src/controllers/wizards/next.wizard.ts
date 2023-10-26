import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { NEXT_WIZARD_ID } from 'src/core/constants';
import { MessageContext, MsgWithExtra } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Wizard(NEXT_WIZARD_ID)
export class NextActionWizard {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: MessageContext): Promise<MsgWithExtra> {
    await ctx.scene.leave();
    return [
      'messages.next_action',
      {
        reply_markup: await this.replyUseCases.getMainMenuMarkup(ctx),
      },
    ];
  }
}
