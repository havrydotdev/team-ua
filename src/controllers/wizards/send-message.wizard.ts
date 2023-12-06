/* eslint-disable perfectionist/sort-classes */
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  Keyboards,
  NEXT_WIZARD_ID,
  SEND_MESSAGE_WIZARD_ID,
  SKIP_STEP_CALLBACK,
} from 'src/core/constants';
import {
  HandlerResponse,
  PhotoMessage,
  SendMessageWizardContext,
} from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

// TODO: add confirm step
@Wizard(SEND_MESSAGE_WIZARD_ID)
export class SendMessageWizard {
  constructor(private readonly userUseCases: UserUseCases) {}

  @WizardStep(1)
  async onEnter(
    @Ctx() ctx: SendMessageWizardContext,
  ): Promise<HandlerResponse> {
    ctx.wizard.state.message = {};

    ctx.wizard.next();

    return [
      'messages.send_message.enter_ua',
      {
        reply_markup: Keyboards.remove,
      },
    ];
  }

  @On('text')
  @WizardStep(2)
  async onUa(
    @Ctx() ctx: SendMessageWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    ctx.wizard.state.message.ua = msg.text;

    ctx.wizard.next();

    return [
      'messages.send_message.enter_en',
      {
        reply_markup: Keyboards.skipStep,
      },
    ];
  }

  @On('text')
  @WizardStep(3)
  async onEn(
    @Ctx() ctx: SendMessageWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    if (msg.text === SKIP_STEP_CALLBACK) {
      ctx.wizard.state.message.en = ctx.wizard.state.message.ua;

      ctx.wizard.next();

      return;
    }

    ctx.wizard.state.message.en = msg.text;

    ctx.wizard.next();

    return [
      'messages.send_message.photo',
      {
        reply_markup: Keyboards.skipStep,
      },
    ];
  }

  @On('message')
  @WizardStep(4)
  async onPhoto(
    @Ctx() ctx: SendMessageWizardContext,
    @Message() msg: PhotoMessage,
  ): Promise<HandlerResponse> {
    const photo = (msg.photo ?? []).pop();
    const users = await this.userUseCases.findAll();

    for (const user of users) {
      console.log(ctx.wizard.state.message[user.lang]);
      try {
        const text =
          ctx.wizard.state.message[user.lang] ?? ctx.wizard.state.message.ua;

        if (photo) {
          await ctx.telegram.sendPhoto(user.id, photo.file_id, {
            caption: text,
          });
        } else {
          await ctx.telegram.sendMessage(user.id, text);
        }
      } catch (e) {
        console.log(e);
      }
    }

    await ctx.scene.enter(NEXT_WIZARD_ID);

    return 'messages.send_message.sent';
  }
}
