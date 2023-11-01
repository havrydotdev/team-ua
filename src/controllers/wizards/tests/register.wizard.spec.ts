import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterWizard } from 'src/controllers/wizards/register.wizard';
import { NEXT_WIZARD_ID } from 'src/core/constants';
import { Game, Profile, User } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import {
  getGamesMarkup,
  getNameMarkup,
  getRemoveKeyboardMarkup,
} from 'src/core/utils';
import { PhotoMessage, WizardMessageContext } from 'src/types/telegraf';
import { FileUseCases } from 'src/use-cases/file';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';
import { Markup } from 'telegraf';

jest.mock('src/core/utils', () => {
  const originalModule = jest.requireActual('src/core/utils');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    fileFromMsg: jest.fn(() => {
      return {
        content: Buffer.from(''),
        name: 'test',
      };
    }),
  };
});

describe('RegisterWizard', () => {
  let wizard: RegisterWizard;
  let gameUseCases: GameUseCases;
  let fileUseCases: FileUseCases;
  let profileUseCases: ProfileUseCases;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterWizard,
        {
          provide: GameUseCases,
          useValue: createMock<GameUseCases>(),
        },
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
        {
          provide: UserUseCases,
          useValue: createMock<UserUseCases>(),
        },
        {
          provide: FileUseCases,
          useValue: createMock<FileUseCases>(),
        },
        {
          provide: ProfileUseCases,
          useValue: createMock<ProfileUseCases>(),
        },
      ],
    }).compile();

    wizard = module.get<RegisterWizard>(RegisterWizard);
    gameUseCases = module.get<GameUseCases>(GameUseCases);
    fileUseCases = module.get<FileUseCases>(FileUseCases);
    profileUseCases = module.get<ProfileUseCases>(ProfileUseCases);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('onEnter', () => {
    it('should call enterName on the reply use cases and go to the next step', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          next: jest.fn(),
        },
        from: {
          first_name: 'John',
        },
      });

      const resp = await wizard.onEnter(ctx);

      expect(resp).toEqual([
        ['messages.user.new', {}],
        [
          'messages.name.send',
          { reply_markup: getNameMarkup(ctx.from.first_name) },
        ],
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onName', () => {
    it('should set the name state and go to the next step', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });
      const msg = { text: 'name' };

      const resp = await wizard.onName(ctx, msg);

      expect(ctx.wizard.state.name).toEqual(msg.text);
      expect(resp).toEqual([
        'messages.age.send',
        { reply_markup: Markup.removeKeyboard().reply_markup },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onAge', () => {
    it('should call enterAge on the reply use cases and go to the next step', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });

      const resp = await wizard.onAge(ctx, { text: '17' });

      expect(resp).toEqual('messages.about.send');
      expect(ctx.wizard.state.age).toEqual(17);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });

    it('should return error message if age is not a number', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });

      const resp = await wizard.onAge(ctx, { text: 'invalid age' });

      expect(resp).toEqual('messages.age.invalid');
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(ctx.wizard.state.age).toEqual(undefined);
    });
  });

  describe('onAbout', () => {
    it('should set the about state and go to the next step', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          next: jest.fn(),
          state: {},
        },
        me: 'test',
      });
      const msg = { text: 'Kharkiv' };
      const resp = await wizard.onAbout(ctx, msg);

      expect(ctx.wizard.state.about).toEqual(msg.text);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(resp).toEqual([
        'messages.game.send',
        {
          reply_markup: getGamesMarkup(),
          i18nArgs: {
            username: ctx.me,
          },
        },
      ]);
    });
  });

  describe('onGame', () => {
    it('should set the games state', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });

      const findByTitleSpy = jest
        .spyOn(gameUseCases, 'findByTitle')
        .mockResolvedValueOnce(createMock<Game>({ id: 1 }));

      const msg = { text: 'game1' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state.games).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(findByTitleSpy).toHaveBeenCalledWith(msg.text);
      expect(resp).toEqual('messages.game.ok');
    });

    it('should throw an error if the game is not in the list', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });
      const msg = { text: 'game_that_does_not_exist' };

      const findByTitleSpy = jest
        .spyOn(gameUseCases, 'findByTitle')
        .mockResolvedValueOnce(undefined);

      expect(async () => await wizard.onGame(ctx, msg)).rejects.toThrowError(
        new BotException('messages.game.invalid'),
      );
      expect(ctx.wizard.state.games).toEqual(undefined);
      expect(findByTitleSpy).toHaveBeenCalledWith(msg.text);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
    });

    it('should send error message if game is already in state', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {
            games: [1],
          },
          next: jest.fn(),
        },
      });
      const msg = { text: 'game1' };

      const findByTitleSpy = jest
        .spyOn(gameUseCases, 'findByTitle')
        .mockResolvedValueOnce(createMock<Game>({ id: 1 }));

      expect(async () => await wizard.onGame(ctx, msg)).rejects.toThrowError(
        new BotException('messages.game.already_added'),
      );
      expect(findByTitleSpy).toHaveBeenCalledWith(msg.text);
      expect(ctx.wizard.state['games']).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
    });

    it('should go to the next step if the message is ✅', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {},
          next: jest.fn(),
        },
      });
      const msg = { text: '✅' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state['games']).toEqual(undefined);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(resp).toEqual([
        'messages.picture.send',
        {
          reply_markup: getRemoveKeyboardMarkup(),
        },
      ]);
    });
  });

  describe('onPhoto', () => {
    it('should call enterPicture on the reply use cases and go to the next step', async () => {
      const ctx = createMock<WizardMessageContext>({
        wizard: {
          state: {
            name: 'test',
            age: 17,
            about: 'test',
            games: [1],
          },
          next: jest.fn(),
        },
        from: {
          id: 12345,
        },
        session: {
          user: createMock<User>(),
        },
        scene: {
          enter: jest.fn(),
        },
      });
      const profileDto = {
        name: ctx.wizard.state.name,
        age: ctx.wizard.state.age,
        about: ctx.wizard.state.about,
        games: ctx.wizard.state.games,
        userId: ctx.from.id,
        fileId: 1,
      };
      const createdProfile = createMock<Profile>({
        id: 1,
        name: 'test',
        age: 17,
      });

      const uploadSpy = jest
        .spyOn(fileUseCases, 'upload')
        .mockResolvedValueOnce(1);
      const createSpy = jest
        .spyOn(profileUseCases, 'create')
        .mockResolvedValueOnce(createdProfile);
      const resp = await wizard.onPhoto(ctx, createMock<PhotoMessage>());

      expect(uploadSpy).toHaveBeenCalledWith(Buffer.from(''), 'test');
      expect(createSpy).toHaveBeenCalledWith(profileDto);
      expect(ctx.session.user.profile).toEqual(createdProfile);
      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctx,
        'messages.register.completed',
      );
      expect(resp).toEqual(undefined);
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
    });
  });
});
