/* eslint-disable perfectionist/sort-classes */
import { SkipThrottle } from '@nestjs/throttler';
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  Keyboards,
  NEXT_WIZARD_ID,
  REGISTER_WIZARD_ID,
} from 'src/core/constants';
import { ReqUser } from 'src/core/decorators';
import { CreateProfileDto } from 'src/core/dtos';
import { Profile, User } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { AboutPipe, AgePipe, GamePipe } from 'src/core/pipes';
import { getNameMarkup } from 'src/core/utils';
import {
  HandlerResponse,
  MsgWithExtra,
  PhotoMessage,
  RegisterWizardContext,
} from 'src/types/telegraf';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';

// TODO: add confirm step
// TODO: add "do not change" button for each step
@SkipThrottle()
@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly profileUseCases: ProfileUseCases,
  ) {}

  @WizardStep(1)
  async onEnter(
    @Ctx() ctx: RegisterWizardContext,
    @ReqUser() profile: Profile,
  ): Promise<HandlerResponse> {
    ctx.wizard.next();

    ctx.wizard.state.games = [];

    const resp: MsgWithExtra[] = [];

    if (!profile) {
      resp.push(['messages.user.new', {}]);
    }

    resp.push([
      'messages.name.send',
      {
        reply_markup: getNameMarkup(ctx.from.first_name),
      },
    ]);

    return resp;
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: RegisterWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    ctx.wizard.state.name = msg.text;

    ctx.wizard.next();

    return [
      'messages.age.send',
      {
        reply_markup: Keyboards.remove,
      },
    ];
  }

  @On('text')
  @WizardStep(3)
  async onAge(
    @Ctx() ctx: RegisterWizardContext,
    @Message(AgePipe) msg: { text: number },
  ): Promise<HandlerResponse> {
    ctx.wizard.state['age'] = msg.text;

    ctx.wizard.next();

    return 'messages.about.send';
  }

  @On('text')
  @WizardStep(4)
  async onAbout(
    @Ctx() ctx: RegisterWizardContext,
    @Message(AboutPipe) msg: { text: string },
  ): Promise<HandlerResponse> {
    const about = msg.text;

    ctx.wizard.state['about'] = about;

    ctx.wizard.next();

    return [
      'messages.game.send',
      {
        i18nArgs: {
          username: ctx.me,
        },
        reply_markup: Keyboards.games,
      },
    ];
  }

  @On('text')
  @WizardStep(5)
  async onGame(
    @Ctx() ctx: RegisterWizardContext,
    @Message(GamePipe) msg: { gameId: number; text: string },
  ): Promise<HandlerResponse> {
    if (msg.text === '✅') {
      if (ctx.wizard.state.games.length === 0) {
        throw new BotException('errors.unknown');
      }

      ctx.wizard.next();

      return [
        'messages.picture.send',
        {
          reply_markup: Keyboards.remove,
        },
      ];
    }

    if (ctx.wizard.state.games.includes(msg.gameId)) {
      throw new BotException('messages.game.already_added');
    }

    ctx.wizard.state.games.push(msg.gameId);

    return 'messages.game.ok';
  }

  @On('photo')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: RegisterWizardContext,
    @Message() msg: PhotoMessage,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    const fileId = msg.photo.pop().file_id;

    const profileDto: CreateProfileDto = {
      about: ctx.wizard.state.about,
      age: ctx.wizard.state.age,
      fileId,
      games: ctx.wizard.state.games,
      name: ctx.wizard.state.name,
      userId: ctx.from.id,
    };

    if (user.profile) {
      await this.profileUseCases.update(user.profile.id, profileDto);

      await this.replyUseCases.replyI18n(ctx, 'messages.register.completed');

      await ctx.scene.enter(NEXT_WIZARD_ID);

      return;
    }

    await this.profileUseCases.create(profileDto);

    await this.replyUseCases.replyI18n(ctx, 'messages.register.completed');

    await ctx.scene.enter(NEXT_WIZARD_ID);

    return;
  }
}
