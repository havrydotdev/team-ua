import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Game, User } from 'src/core';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { Language } from 'src/core/enums';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';
import { Context } from 'telegraf/typings';
import { Message as MessageType } from 'telegraf/typings/core/types/typegram';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  private games: Game[];

  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly replyUseCases: ReplyUseCases,
    private readonly gameUseCases: GameUseCases,
  ) {
    this.gameUseCases.findAll().then((games: Game[]) => {
      console.log(games);
      this.games = games;
    });
  }

  @WizardStep(1)
  async onEnter(@Ctx() ctx: Context & WizardContext) {
    ctx.wizard.next();

    await this.replyUseCases.enterName(ctx);
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: Context & WizardContext,
    @Message() msg: { text: string },
  ) {
    ctx.wizard.state['name'] = msg.text;

    ctx.wizard.next();

    await this.replyUseCases.enterAge(ctx);
  }

  @On('text')
  @WizardStep(3)
  async onAge(
    @Ctx() ctx: Context & WizardContext,
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
    @Ctx() ctx: Context & WizardContext,
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
    @Ctx() ctx: Context & WizardContext,
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

  @On('message')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: Context & WizardContext,
    @Message() msg: MessageType.PhotoMessage,
  ) {
    if (msg.photo.length === 0) {
    }
    const imageId = msg.photo.pop().file_id;

    ctx.wizard.state['photo'] = imageId;

    ctx.wizard.next();
  }

  @WizardStep(7)
  async onDone(
    @Ctx()
    ctx: WizardContext & {
      session: {
        user?: User;
        lang: Language;
      };
    } & {
      wizard: {
        state: {
          name: string;
          location: string;
          age: number;
          games: number[];
        };
      };
    },
  ) {
    await ctx.scene.leave();
  }
}
