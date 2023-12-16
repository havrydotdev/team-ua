/* eslint-disable perfectionist/sort-classes */
import { SkipThrottle } from '@nestjs/throttler';
import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CANCEL_CALLBACK,
  CONFIRM_CALLBACK,
  Keyboards,
  NEXT_WIZARD_ID,
  SEND_MESSAGE_WIZARD_ID,
  SKIP_STEP_CALLBACK,
} from 'src/core/constants';
import { ReqUser } from 'src/core/decorators';
import { User } from 'src/core/entities';
import {
  HandlerResponse,
  PhotoMessage,
  SendMessageWizardContext,
  TextMessage,
} from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';

@SkipThrottle()
// TODO: add confirm step
@Wizard(SEND_MESSAGE_WIZARD_ID)
export class SendMessageWizard {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @WizardStep(1)
  async onEnter(
    @Ctx() ctx: SendMessageWizardContext,
  ): Promise<HandlerResponse> {
    ctx.wizard.state.message = {};

    ctx.wizard.next();

    return [
      'messages.send_message.enter.ua',
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
      'messages.send_message.enter.en',
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
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    await this.replyUseCases.replyI18n(ctx, 'messages.send_message.ready');

    const photo = (msg.photo ?? []).pop();
    ctx.wizard.state.photo = photo ? photo.file_id : undefined;

    const text =
      ctx.wizard.state.message[user.lang] ?? ctx.wizard.state.message.ua;

    if (ctx.wizard.state.photo) {
      await ctx.telegram.sendPhoto(user.id, ctx.wizard.state.photo, {
        caption: text,
      });
    } else {
      await ctx.telegram.sendMessage(user.id, text);
    }

    ctx.wizard.next();

    return [
      'messages.send_message.accept',
      {
        reply_markup: Keyboards.refill,
      },
    ];
  }

  @Hears([CONFIRM_CALLBACK, CANCEL_CALLBACK])
  @WizardStep(5)
  async onAccept(
    @Ctx() ctx: SendMessageWizardContext,
    @Message() msg: TextMessage,
  ): Promise<HandlerResponse> {
    if (msg.text == CANCEL_CALLBACK) {
      ctx.scene.enter(NEXT_WIZARD_ID);

      return 'messages.send_message.canceled';
    }

    const users = await this.userUseCases.findAll();

    for (const user of users) {
      try {
        const text =
          ctx.wizard.state.message[user.lang] ?? ctx.wizard.state.message.ua;

        if (ctx.wizard.state.photo) {
          await ctx.telegram.sendPhoto(user.id, ctx.wizard.state.photo, {
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
