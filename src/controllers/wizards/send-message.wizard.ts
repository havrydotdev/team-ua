/* eslint-disable perfectionist/sort-classes */
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { SEND_MESSAGE_WIZARD_ID } from 'src/core/constants';
import { Registered, ReqUser } from 'src/core/decorators';
import { Profile } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { HandlerResponse, WizardContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';

// TODO: add multi-language messages
// TODO: add photo support
@Wizard(SEND_MESSAGE_WIZARD_ID)
export class SendMessageWizard {
  constructor(private readonly profileUseCases: ProfileUseCases) {}

  @WizardStep(1)
  @Registered()
  async onEnter(
    @Ctx() ctx: WizardContext,
    @ReqUser() profile: Profile,
  ): Promise<HandlerResponse> {
    if (profile.user.role !== 'admin') {
      throw new BotException('errors.forbidden');
    }

    ctx.wizard.next();

    return 'messages.send_message.enter';
  }

  @On('text')
  @WizardStep(2)
  async onLang(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    const profiles = await this.profileUseCases.findAll();

    for (const profile of profiles) {
      await ctx.telegram.sendMessage(profile.user.id, msg.text);
    }

    await ctx.scene.leave();
  }
}
