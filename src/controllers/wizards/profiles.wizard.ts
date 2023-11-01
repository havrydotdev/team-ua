import { Ctx, Hears, Message, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  NEXT_WIZARD_ID,
  PROFILES_WIZARD_ID,
} from 'src/core/constants';
import { getCaption, getProfileMarkup } from 'src/core/utils';
import { ProfilesMessageContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';
import { deunionize } from 'telegraf';

@Wizard(PROFILES_WIZARD_ID)
export class ProfilesWizard {
  constructor(private readonly profileUseCases: ProfileUseCases) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: ProfilesMessageContext) {
    const profile = await this.profileUseCases.findRecommended(
      ctx.session.user.profile,
    );

    ctx.wizard.state.current = profile;
    ctx.wizard.next();

    const chat = await ctx.telegram.getChat(profile.user.id);

    await ctx.replyWithPhoto(
      { url: ctx.wizard.state.current.file.url },
      {
        caption: getCaption(profile),
        reply_markup: getProfileMarkup(
          `https://t.me/${deunionize(chat).username}`,
        ),
      },
    );
  }

  @WizardStep(2)
  @Hears([NEXT_PROFILE_CALLBACK, LEAVE_PROFILES_CALLBACK])
  async onAction(
    @Ctx() ctx: ProfilesMessageContext,
    @Message() msg: { text: string },
  ) {
    switch (msg.text) {
      case NEXT_PROFILE_CALLBACK: {
        ctx.scene.leave();

        await ctx.scene.enter(PROFILES_WIZARD_ID);

        break;
      }

      case LEAVE_PROFILES_CALLBACK: {
        ctx.scene.leave();

        await ctx.scene.enter(NEXT_WIZARD_ID);

        break;
      }
    }
  }
}
