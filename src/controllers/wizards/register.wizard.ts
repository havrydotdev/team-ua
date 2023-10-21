import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { CreateProfileDto, Game } from 'src/core';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { Extra } from 'src/core/types';
import { fetchImage, getRemoveKeyboardMarkup } from 'src/core/utils';
import { getGamesMarkup, getNameMarkup } from 'src/core/utils';
import { WizardMessageContext, PhotoMessage, MsgKey } from 'src/types/telegraf';
import { FileUseCases } from 'src/use-cases/file/file.use-case.service';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';

// TODO: add global exception filter
@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  private games: Game[];

  constructor(
    private readonly replyUseCases: ReplyUseCases,
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
  async onEnter(@Ctx() ctx: WizardMessageContext): Promise<[MsgKey, Extra]> {
    ctx.wizard.next();

    return [
      'messages.enter_name',
      { reply_markup: getNameMarkup(ctx.from.first_name) },
    ];
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey> {
    ctx.wizard.state['name'] = msg.text;

    ctx.wizard.next();

    return 'messages.enter_age';
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

    const tgFileId = msg.photo.pop().file_id;

    const user = await this.userUseCases.getByTgId(ctx.from.id);

    //  TODO: handle error
    if (!user) {
      console.log('error');

      return;
    }

    const fileUrl = await ctx.telegram.getFileLink(tgFileId);

    const file = await fetchImage(fileUrl);

    const fileId = await this.fileUseCases.upload(file, tgFileId);

    const profileDto: CreateProfileDto = {
      userId: user.id,
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
