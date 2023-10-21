import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { CreateProfileDto, Game } from 'src/core';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { WizardMessageContext, PhotoMessage } from 'src/types/telegraf';
import { FileUseCases } from 'src/use-cases/file/file.use-case.service';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';

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
  async onEnter(@Ctx() ctx: WizardMessageContext) {
    ctx.wizard.next();

    console.log(ctx);

    await this.replyUseCases.enterName(ctx);
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ) {
    ctx.wizard.state['name'] = msg.text;

    ctx.wizard.next();

    await this.replyUseCases.enterAge(ctx);
  }

  @On('text')
  @WizardStep(3)
  async onAge(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ) {
    const age = parseInt(msg.text);

    if (isNaN(age)) {
      await this.replyUseCases.invalidAge(ctx);

      return;
    }

    ctx.wizard.state['age'] = age;

    ctx.wizard.next();

    await this.replyUseCases.sendLocation(ctx);
  }

  @On('text')
  @WizardStep(4)
  async onLocation(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ) {
    const location = msg.text;

    ctx.wizard.state['location'] = location;

    ctx.wizard.next();

    await this.replyUseCases.sendGames(ctx, this.games);
  }

  @On('text')
  @WizardStep(5)
  async onGame(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ) {
    if (msg.text === '✅') {
      ctx.wizard.next();

      await this.replyUseCases.sendPicture(ctx);

      return;
    }

    const game = this.games.find((game) => game.title === msg.text);
    if (!game) {
      await this.replyUseCases.invalidGame(ctx);

      return;
    }

    if (ctx.wizard.state['games']?.includes(game.id)) {
      await this.replyUseCases.invalidGame(ctx);

      return;
    }

    if (!ctx.wizard.state['games']) {
      ctx.wizard.state['games'] = [];
    }

    ctx.wizard.state['games'].push(game.id);

    await this.replyUseCases.gameAdded(ctx);
  }

  @On('photo')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: WizardMessageContext,
    @Message() msg: PhotoMessage,
  ) {
    if (msg.photo.length === 0) {
      console.log('error');

      return;
    }

    const tgFileId = msg.photo.pop().file_id;

    const user = await this.userUseCases.getByTgId(ctx.from.id);

    if (!user) {
      console.log('error');

      return;
    }

    const fileUrl = await ctx.telegram.getFileLink(tgFileId);

    const file = await (await fetch(fileUrl)).arrayBuffer();

    const fileId = await this.fileUseCases.upload(Buffer.from(file), tgFileId);

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

    await this.replyUseCases.sendRegister(ctx);
  }
}
