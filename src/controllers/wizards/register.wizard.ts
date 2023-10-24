import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { CreateProfileDto } from 'src/core/dtos';
import { Game } from 'src/core/entities';
import { Extra } from 'src/core/types';
import {
  fileFromMsg,
  getGamesMarkup,
  getNameMarkup,
  getRemoveKeyboardMarkup,
} from 'src/core/utils';
import {
  MsgKey,
  MsgWithExtra,
  PhotoMessage,
  WizardMessageContext,
} from 'src/types/telegraf';
import { FileUseCases } from 'src/use-cases/file/file.use-case.service';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { UserUseCases } from 'src/use-cases/user';

// TODO: add global exception filter
@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  private games: Game[];

  constructor(
    private readonly gameUseCases: GameUseCases,
    private readonly userUseCases: UserUseCases,
    private readonly fileUseCases: FileUseCases,
    private readonly profileUseCases: ProfileUseCases,
  ) {
    this.gameUseCases.findAll().then((games: Game[]) => {
      this.games = games;
    });
  }

  @WizardStep(1)
  async onEnter(@Ctx() ctx: WizardMessageContext): Promise<MsgWithExtra[]> {
    ctx.wizard.next();

    return [
      ['messages.new_user', {}],
      [
        'messages.enter_name',
        { reply_markup: getNameMarkup(ctx.from.first_name) },
      ],
    ];
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<[MsgKey, Extra]> {
    ctx.wizard.state['name'] = msg.text;

    ctx.wizard.next();

    return [
      'messages.enter_age',
      {
        reply_markup: getRemoveKeyboardMarkup(),
      },
    ];
  }

  @On('text')
  @WizardStep(3)
  async onAge(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey> {
    const age = parseInt(msg.text);

    if (isNaN(age)) {
      return 'messages.invalid_age';
    }

    ctx.wizard.state['age'] = age;

    ctx.wizard.next();

    return 'messages.send_location';
  }

  @On('text')
  @WizardStep(4)
  async onLocation(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<[MsgKey, Extra]> {
    const location = msg.text;

    ctx.wizard.state['location'] = location;

    ctx.wizard.next();

    return [
      'messages.send_games',
      {
        reply_markup: getGamesMarkup(this.games),
      },
    ];
  }

  @On('text')
  @WizardStep(5)
  async onGame(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey | [MsgKey, Extra]> {
    if (msg.text === '✅') {
      ctx.wizard.next();

      return [
        'messages.send_picture',
        {
          reply_markup: getRemoveKeyboardMarkup(),
        },
      ];
    }

    const game = this.games.find((game) => game.title === msg.text);
    if (!game) {
      return 'messages.invalid_game';
    }

    if (ctx.wizard.state['games']?.includes(game.id)) {
      return 'messages.invalid_game';
    }

    if (!ctx.wizard.state['games']) {
      ctx.wizard.state['games'] = [];
    }

    ctx.wizard.state['games'].push(game.id);

    return 'messages.game_added';
  }

  // TODO: add tests for this handler
  @On('photo')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: WizardMessageContext,
    @Message() msg: PhotoMessage,
  ) {
    // TODO: handle error
    if (msg.photo.length === 0) {
      console.log('error');

      return;
    }

    const file = await fileFromMsg(ctx, msg);

    const fileId = await this.fileUseCases.upload(file.content, file.name);

    const profileDto: CreateProfileDto = {
      userId: ctx.from.id,
      name: ctx.wizard.state['name'],
      age: ctx.wizard.state['age'],
      location: ctx.wizard.state['location'],
      games: ctx.wizard.state['games'],
      about: '',
      fileId,
    };

    const profile = await this.profileUseCases.create(profileDto);

    ctx.session.user.profile = profile;

    await ctx.scene.leave();

    return 'messages.register_completed';
  }
}
