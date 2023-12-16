/* eslint-disable perfectionist/sort-classes */
import { SkipThrottle } from '@nestjs/throttler';
import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CANCEL_CALLBACK,
  CONFIRM_CALLBACK,
  DONT_CHANGE_CALLBACK,
  Keyboards,
  NEXT_WIZARD_ID,
  REGISTER_WIZARD_ID,
} from 'src/core/constants';
import { ReqUser } from 'src/core/decorators';
import { CreateProfileDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { AboutPipe, AgePipe, GameExistPipe } from 'src/core/pipes';
import { getCaption, getDontChangeMarkup } from 'src/core/utils';
import {
  GameExistMessage,
  HandlerResponse,
  KeywordMessage,
  MsgWithExtra,
  PhotoMessage,
  RegisterWizardContext,
  TextMessage,
} from 'src/types/telegraf';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';

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
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    ctx.wizard.next();

    ctx.wizard.state.games = [];

    const resp: MsgWithExtra[] = [];

    if (!user.profile) {
      resp.push(['messages.user.new', {}]);
    }

    resp.push([
      'messages.name.send',
      {
        reply_markup: getDontChangeMarkup(
          user.profile ? user.profile.name : ctx.from.first_name,
        ),
      },
    ]);

    return resp;
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: RegisterWizardContext,
    @Message() msg: { text: string },
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    ctx.wizard.state.name = msg.text;

    ctx.wizard.next();

    return [
      'messages.age.send',
      {
        reply_markup: user.profile
          ? getDontChangeMarkup(user.profile.age.toString())
          : Keyboards.remove,
      },
    ];
  }

  @On('text')
  @WizardStep(3)
  async onAge(
    @Ctx() ctx: RegisterWizardContext,
    @Message(AgePipe) msg: { text: number },
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    ctx.wizard.state['age'] = msg.text;

    ctx.wizard.next();

    return [
      'messages.about.send',
      {
        reply_markup: user.profile
          ? getDontChangeMarkup(user.profile.about)
          : Keyboards.remove,
      },
    ];
  }

  @On('text')
  @WizardStep(4)
  async onAbout(
    @Ctx() ctx: RegisterWizardContext,
    @Message(AboutPipe) msg: { text: string },
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    const about = msg.text;

    ctx.wizard.state['about'] = about;

    ctx.wizard.next();

    return [
      user.profile ? 'messages.game.send_existing' : 'messages.game.send',
      {
        i18nArgs: {
          callback: DONT_CHANGE_CALLBACK,
          username: ctx.me,
        },
        reply_markup: user.profile ? Keyboards.gamesWithSkip : Keyboards.games,
      },
    ];
  }

  @On('text')
  @WizardStep(5)
  async onGame(
    @Ctx() ctx: RegisterWizardContext,
    @Message(
      GameExistPipe({
        allow: [CONFIRM_CALLBACK, DONT_CHANGE_CALLBACK],
      }),
    )
    msg: GameExistMessage | KeywordMessage,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    if ((msg as KeywordMessage).keyword) {
      if (user.profile && msg.text === DONT_CHANGE_CALLBACK) {
        ctx.wizard.state.games = user.profile.games.map((game) => game.id);
      }

      if (ctx.wizard.state.games.length === 0) {
        throw new BotException('errors.unknown');
      }

      ctx.wizard.next();

      return [
        user.profile
          ? 'messages.picture.send_existing'
          : 'messages.picture.send',
        {
          i18nArgs: {
            callback: DONT_CHANGE_CALLBACK,
          },
          reply_markup: user.profile
            ? getDontChangeMarkup(DONT_CHANGE_CALLBACK)
            : Keyboards.remove,
        },
      ];
    }

    const gameMsg = msg as GameExistMessage;

    if (ctx.wizard.state.games.includes(gameMsg.gameId)) {
      throw new BotException('messages.game.already_added');
    }

    if (ctx.wizard.state.games.length === 10) {
      throw new BotException('messages.game.maximum_added');
    }

    ctx.wizard.state.games.push(gameMsg.gameId);

    return 'messages.game.ok';
  }

  @On('message')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: RegisterWizardContext,
    @Message()
    msg: PhotoMessage | TextMessage,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    const fileId =
      user.profile && (msg as TextMessage).text === DONT_CHANGE_CALLBACK
        ? user.profile.fileId
        : (msg as PhotoMessage).photo.pop().file_id;

    const profileDto: CreateProfileDto = {
      about: ctx.wizard.state.about,
      age: ctx.wizard.state.age,
      fileId,
      games: ctx.wizard.state.games,
      name: ctx.wizard.state.name,
      userId: ctx.from.id,
    };

    const profile = user.profile
      ? await this.profileUseCases.update(user.profile.id, profileDto)
      : await this.profileUseCases.create(profileDto);

    await this.replyUseCases.replyI18n(ctx, 'messages.profile.ready');

    await ctx.replyWithPhoto(user.profile.fileId, {
      caption: getCaption(profile),
    });

    await this.replyUseCases.replyI18n(ctx, 'messages.profile.refill', {
      reply_markup: Keyboards.refill,
    });

    ctx.wizard.next();
  }

  @Hears([CONFIRM_CALLBACK, CANCEL_CALLBACK])
  @WizardStep(7)
  async onAnswer(
    @Ctx()
    ctx: RegisterWizardContext,
    @Message() msg: TextMessage,
  ): Promise<HandlerResponse> {
    switch (msg.text) {
      case CONFIRM_CALLBACK:
        await ctx.scene.reenter();
        break;

      case CANCEL_CALLBACK:
        await ctx.scene.enter(NEXT_WIZARD_ID);
        break;
    }
  }
}
