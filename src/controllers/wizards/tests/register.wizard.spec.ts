import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { RegisterWizard } from 'src/controllers/wizards/register.wizard';
import { Keyboards, NEXT_WIZARD_ID } from 'src/core/constants';
import { CreateProfileDto } from 'src/core/dtos';
import { Profile, User } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { getNameMarkup } from 'src/core/utils';
import { PhotoMessage, RegisterWizardContext } from 'src/types/telegraf';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { PhotoSize } from 'telegraf/typings/core/types/typegram';

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
  let profileUseCases: jest.Mocked<ProfileUseCases>;
  let replyUseCases: jest.Mocked<ReplyUseCases>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(RegisterWizard).compile();

    wizard = unit;
    profileUseCases = unitRef.get(ProfileUseCases);
    replyUseCases = unitRef.get(ReplyUseCases);
  });

  describe('onEnter', () => {
    it('should call enterName on the reply use cases and go to the next step', async () => {
      const ctx = createMock<RegisterWizardContext>({
        from: {
          first_name: 'John',
        },
        wizard: {
          next: jest.fn(),
          state: {
            games: undefined,
          },
        },
      });

      const resp = await wizard.onEnter(ctx, undefined);

      console.log({ resp });

      expect(resp).toEqual([
        ['messages.user.new', {}],
        [
          'messages.name.send',
          { reply_markup: getNameMarkup(ctx.from.first_name) },
        ],
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(ctx.wizard.state.games).not.toBeUndefined();
    });
  });

  describe('onName', () => {
    it('should send new user message if profile is undefined', async () => {
      const ctx = createMock<RegisterWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {},
        },
      });
      const msg = { text: 'name' };

      const resp = await wizard.onName(ctx, msg);

      expect(ctx.wizard.state.name).toEqual(msg.text);
      expect(resp).toEqual([
        'messages.age.send',
        {
          reply_markup: Keyboards.remove,
        },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onAge', () => {
    it('should call enterAge on the reply use cases and go to the next step', async () => {
      const ctx = createMock<RegisterWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {},
        },
      });

      const resp = await wizard.onAge(ctx, { text: 17 });

      expect(resp).toEqual('messages.about.send');
      expect(ctx.wizard.state.age).toEqual(17);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onAbout', () => {
    it('should set the about state and go to the next step', async () => {
      const ctx = createMock<RegisterWizardContext>({
        me: 'test',
        wizard: {
          next: jest.fn(),
          state: {},
        },
      });
      const msg = { text: 'Kharkiv' };
      const resp = await wizard.onAbout(ctx, msg);

      expect(ctx.wizard.state.about).toEqual(msg.text);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(resp).toEqual([
        'messages.game.send',
        {
          i18nArgs: {
            username: ctx.me,
          },
          reply_markup: Keyboards.games,
        },
      ]);
    });
  });

  describe('onGame', () => {
    it('should set the games state', async () => {
      const ctx = createMock<RegisterWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            games: [],
          },
        },
      });

      const msg = { gameId: 1, text: 'game1' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state.games).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(resp).toEqual('messages.game.ok');
    });

    it('should send error message if game is already in state', async () => {
      const ctx = createMock<RegisterWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            games: [1],
          },
        },
      });
      const msg = { gameId: 1, text: 'game1' };

      expect(async () => await wizard.onGame(ctx, msg)).rejects.toThrowError(
        new BotException('messages.game.already_added'),
      );
      expect(ctx.wizard.state.games).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
    });

    it('should go to the next step if the message is ✅', async () => {
      const ctx = createMock<RegisterWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            games: [],
          },
        },
      });
      const msg = { gameId: 1, text: '✅' };

      expect(wizard.onGame(ctx, msg)).rejects.toThrowError(
        new BotException('errors.unknown'),
      );
      expect(ctx.wizard.next).not.toHaveBeenCalled();
    });
  });

  describe('onPhoto', () => {
    it('should create a profile if user does not have one', async () => {
      const ctx = createMock<RegisterWizardContext>({
        from: {
          id: 12345,
        },
        scene: {
          enter: jest.fn(),
        },
        wizard: {
          next: jest.fn(),
          state: {
            about: 'test',
            age: 17,
            games: [1],
            name: 'test',
          },
        },
      });
      const profileDto: CreateProfileDto = {
        about: ctx.wizard.state.about,
        age: ctx.wizard.state.age,
        fileId: '12345',
        games: ctx.wizard.state.games,
        name: ctx.wizard.state.name,
        userId: ctx.from.id,
      };
      const createdProfile = createMock<Profile>({
        age: 17,
        id: 1,
        name: 'test',
      });

      const createSpy = jest
        .spyOn(profileUseCases, 'create')
        .mockResolvedValueOnce(createdProfile);
      const resp = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: [
            createMock<PhotoSize>({
              file_id: '12345',
            }),
          ],
        }),
        createMock<User>({
          profile: undefined,
        }),
      );

      expect(createSpy).toHaveBeenCalledWith(profileDto);
      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctx,
        'messages.register.completed',
      );
      expect(resp).toEqual(undefined);
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
    });

    it('should update a profile if user has one', async () => {
      const ctx = createMock<RegisterWizardContext>({
        from: {
          id: 12345,
        },
        scene: {
          enter: jest.fn(),
        },
        wizard: {
          next: jest.fn(),
          state: {
            about: 'test',
            age: 17,
            games: [1],
            name: 'test',
          },
        },
      });
      const profileDto: CreateProfileDto = {
        about: ctx.wizard.state.about,
        age: ctx.wizard.state.age,
        fileId: '12345',
        games: ctx.wizard.state.games,
        name: ctx.wizard.state.name,
        userId: ctx.from.id,
      };
      const updatedProfile = createMock<Profile>({
        age: 17,
        id: 1,
        name: 'test',
      });

      const updateSpy = jest
        .spyOn(profileUseCases, 'update')
        .mockResolvedValueOnce(updatedProfile);
      const resp = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: [
            createMock<PhotoSize>({
              file_id: '12345',
            }),
          ],
        }),
        createMock<User>({
          profile: createMock<Profile>({
            id: 1,
          }),
        }),
      );

      expect(updateSpy).toHaveBeenCalledWith(1, profileDto);
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(resp).toEqual(undefined);
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
    });
  });
});
