import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CHANGE_LANG_WIZARD_ID,
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  PROFILES_WIZARD_ID,
} from 'src/core/constants';
import { Game, User } from 'src/core/entities';
import { getCaption } from 'src/core/utils';
import { MessageContext } from 'src/types/telegraf';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { Markup } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';
import { AppUpdate } from '../app.update';

describe('AppUpdate', () => {
  let update: AppUpdate;
  let replyUseCases: ReplyUseCases;
  let gameUseCases: GameUseCases;

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
    gameUseCases = module.get<GameUseCases>(GameUseCases);
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

  describe('onCoop', () => {
    it('should reply with the coop message', async () => {
      const resp = await update.onCoop();

      expect(resp).toEqual([
        'commands.coop',
        {
          parse_mode: 'HTML',
        },
      ]);
    });
  });

  describe('onProfiles', () => {
    it('should reply with the profiles message', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onProfiles(ctx);

      expect(replyUseCases.replyI18n).toHaveBeenCalledTimes(2);
      expect(replyUseCases.replyI18n).toHaveBeenNthCalledWith(
        1,
        ctx,
        'messages.searching_teammates',
        {
          reply_markup: Markup.removeKeyboard().reply_markup,
        },
      );
      expect(replyUseCases.replyI18n).toHaveBeenNthCalledWith(
        2,
        ctx,
        'commands.profiles',
        {
          reply_markup: Markup.keyboard([
            [
              Markup.button.callback(
                NEXT_PROFILE_CALLBACK,
                NEXT_PROFILE_CALLBACK,
              ),
              Markup.button.callback(
                LEAVE_PROFILES_CALLBACK,
                LEAVE_PROFILES_CALLBACK,
              ),
            ],
          ]).resize(true).reply_markup,
        },
      );
      expect(ctx.scene.enter).toHaveBeenCalledWith(PROFILES_WIZARD_ID);
    });
  });

  describe('onInlineQuery', () => {
    it('should reply with the inline query results', async () => {
      const games = [
        createMock<Game>({
          id: 1,
          title: 'Test1',
          description: "Test1's description",
          image: "Test1's image",
        }),
        createMock<Game>({
          id: 2,
          title: 'Test2',
          description: "Test2's description",
          image: "Test2's image",
        }),
        createMock<Game>({
          id: 3,
          title: 'Test3',
          description: "Test3's description",
          image: "Test3's image",
        }),
        createMock<Game>({
          id: 4,
          title: 'Test4',
          description: "Test4's description",
          image: "Test4's image",
        }),
      ];
      const ctx = createMock<MessageContext>({
        inlineQuery: {
          query: 'test',
        },
      });

      jest.spyOn(gameUseCases, 'findStartsWith').mockResolvedValueOnce(games);

      await update.onInlineQuery(ctx);

      expect(ctx.answerInlineQuery).toHaveBeenCalledWith(
        games.map(
          (game): InlineQueryResult => ({
            type: 'article',
            id: game.id.toString(),
            title: game.title,
            description: game.description,
            thumbnail_url: game.image,
            input_message_content: {
              message_text: game.title,
            },
          }),
        ),
      );
    });
  });

  describe('onHelp', () => {
    it('should reply with the help message', async () => {
      const resp = await update.onHelp();

      expect(resp).toEqual('commands.help');
    });
  });
});
