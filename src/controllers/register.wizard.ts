import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { Context } from 'telegraf/typings';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: Context & WizardContext) {
    ctx.wizard.next();

    await this.replyUseCases.enterName(ctx);
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: Context & WizardContext,
    @Message() msg: { text: string },
  ) {
    ctx.wizard.state['name'] = msg.text;

    ctx.wizard.next();

    // await this.replyUseCases.enterSurname(ctx);
  }
}
