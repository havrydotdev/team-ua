/* eslint-disable perfectionist/sort-classes */
import { Context, Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CLEAR_LAST_WIZARD_ID,
  CLEAR_LAST_YES_CALLBACK,
  Keyboards,
  NEXT_WIZARD_ID,
} from 'src/core/constants';
import { HandlerResponse, MessageContext, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Wizard(CLEAR_LAST_WIZARD_ID)
export class ClearLastProfilesWizard {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  @WizardStep(1)
  onEnter(@Ctx() ctx: WizardContext): HandlerResponse {
    ctx.wizard.next();

    return [
      [
        'messages.profile.last.no_more',
        {
          reply_markup: Keyboards.remove,
        },
      ],
      [
        'messages.profile.last.clear',
        {
          reply_markup: Keyboards.clearLast,
        },
      ],
    ];
  }

  @WizardStep(2)
  @On('text')
  async onAnswer(
    @Context() ctx: MessageContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    if (msg.text === CLEAR_LAST_YES_CALLBACK) {
      ctx.session.seenProfiles = [];

      this.replyUseCases.replyI18n(ctx, 'messages.profile.last.cleared', {
        reply_markup: Keyboards.remove,
      });
    }

    await ctx.scene.enter(NEXT_WIZARD_ID);
  }
}
