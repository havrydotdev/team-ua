import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CHANGE_LANG_WIZARD_ID } from 'src/core/constants';
import { Game, User } from 'src/core/entities';
import { getCaption } from 'src/core/utils';
import { MessageContext } from 'src/types/telegraf';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { AppUpdate } from '../app.update';

describe('AppUpdate', () => {
  let update: AppUpdate;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppUpdate,
        {
          provide: UserUseCases,
          useValue: createMock<UserUseCases>(),
        },
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
        {
          provide: GameUseCases,
          useValue: createMock<GameUseCases>(),
        },
      ],
    }).compile();

    update = module.get<AppUpdate>(AppUpdate);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('onStart', () => {
    it('should create a new user if one does not exist in the session', async () => {
      const chatId = 123;
      const userId = 456;
      const ctx = createMock<MessageContext>({
        chat: {
          id: chatId,
        },
        from: {
          id: userId,
        },
        session: {
          user: {},
        },
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onStart(ctx);

      expect(replyUseCases.replyI18n).toHaveBeenCalledTimes(1);
      expect(ctx.scene.enter).toHaveBeenCalledWith(CHANGE_LANG_WIZARD_ID);
    });

    it('should not create a new user if one already exists in the session', async () => {
      const ctx = createMock<MessageContext>({
        session: {
          user: createMock<User>({
            id: 1,
          }),
        },
      });

      const resp = await update.onStart(ctx);

      expect(ctx.session.user).toEqual(ctx.session.user);
      expect(resp).toEqual('commands.start');
    });
  });

  describe('onLanguage', () => {
    it('should enter the change language wizard', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onLanguage(ctx);

      expect(ctx.scene.enter).toHaveBeenCalledWith(CHANGE_LANG_WIZARD_ID);
    });
  });

  describe('onMe', () => {
    it('should reply with the user profile', async () => {
      const ctx = createMock<MessageContext>({
        session: {
          user: createMock<User>({
            profile: createMock<User['profile']>({
              file: createMock<User['profile']['file']>({
                url: 'url',
              }),
              name: 'name',
              games: [
                createMock<Game>({
                  title: 'CS:GO',
                }),
                createMock<Game>({
                  title: 'CS 2',
                }),
              ],
            }),
          }),
        },
      });

      await update.onMe(ctx);

      expect(ctx.replyWithPhoto).toHaveBeenCalledWith(
        { url: ctx.session.user.profile.file.url },
        { caption: getCaption(ctx.session.user.profile) },
      );
    });
  });

  describe('onHelp', () => {
    it('should reply with the help message', async () => {
      const ctx = createMock<MessageContext>();

      const resp = await update.onHelp(ctx);

      expect(resp).toEqual('commands.help');
    });
  });
});
