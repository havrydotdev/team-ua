import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  GAMES_MARKUP,
  NEXT_WIZARD_ID,
  REGISTER_WIZARD_ID,
  REMOVE_KEYBOARD_MARKUP,
} from 'src/core/constants';
import { CreateProfileDto } from 'src/core/dtos';
import { BotException } from 'src/core/errors';
import { Extra } from 'src/core/types';
import { fileFromMsg, getNameMarkup } from 'src/core/utils';
import {
  MsgKey,
  MsgWithExtra,
  PhotoMessage,
  WizardMessageContext,
} from 'src/types/telegraf';
import { FileUseCases } from 'src/use-cases/file/file.use-case.service';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';

@Wizard(REGISTER_WIZARD_ID)
export class RegisterWizard {
  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly fileUseCases: FileUseCases,
    private readonly profileUseCases: ProfileUseCases,
    private readonly gameUseCases: GameUseCases,
  ) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: WizardMessageContext): Promise<MsgWithExtra[]> {
    ctx.wizard.next();

    return [
      ['messages.user.new', {}],
      [
        'messages.name.send',
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
    ctx.wizard.state.name = msg.text;

    ctx.wizard.next();

    return [
      'messages.age.send',
      {
        reply_markup: REMOVE_KEYBOARD_MARKUP,
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
      return 'messages.age.invalid';
    }

    ctx.wizard.state['age'] = age;

    ctx.wizard.next();

    return 'messages.about.send';
  }

  @On('text')
  @WizardStep(4)
  async onAbout(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgWithExtra> {
    const about = msg.text;

    ctx.wizard.state['about'] = about;

    ctx.wizard.next();

    return [
      'messages.game.send',
      {
        reply_markup: GAMES_MARKUP,
        i18nArgs: {
          username: ctx.me,
        },
      },
    ];
  }

  @On('text')
  @WizardStep(5)
  async onGame(
    @Ctx() ctx: WizardMessageContext,
    @Message() msg: { text: string },
  ): Promise<MsgKey | MsgWithExtra> {
    if (msg.text === '✅') {
      ctx.wizard.next();

      return [
        'messages.picture.send',
        {
          reply_markup: REMOVE_KEYBOARD_MARKUP,
        },
      ];
    }

    const game = await this.gameUseCases.findByTitle(msg.text);
    if (!game) {
      throw new BotException('messages.game.invalid');
    }

    if (!ctx.wizard.state.games) {
      ctx.wizard.state.games = [];
    }

    if (ctx.wizard.state.games.includes(game.id)) {
      throw new BotException('messages.game.already_added');
    }

    ctx.wizard.state.games.push(game.id);

    return 'messages.game.ok';
  }

  @On('photo')
  @WizardStep(6)
  async onPhoto(
    @Ctx()
    ctx: WizardMessageContext,
    @Message() msg: PhotoMessage,
  ): Promise<MsgKey | MsgWithExtra> {
    const file = await fileFromMsg(ctx, msg);

    const fileId = await this.fileUseCases.upload(file.content, file.name);

    const profileDto: CreateProfileDto = {
      userId: ctx.from.id,
      name: ctx.wizard.state.name,
      age: ctx.wizard.state.age,
      games: ctx.wizard.state.games,
      about: ctx.wizard.state.about,
      fileId,
    };

    const profile = await this.profileUseCases.create(profileDto);

    ctx.session.user.profile = profile;

    await this.replyUseCases.replyI18n(ctx, 'messages.register.completed');
    await ctx.scene.enter(NEXT_WIZARD_ID);

    return;
  }
}
