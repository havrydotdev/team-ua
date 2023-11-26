import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import {
  CHANGE_LANG_WIZARD_ID,
  Keyboards,
  PROFILES_WIZARD_ID,
  REGISTER_WIZARD_ID,
  SEND_MESSAGE_WIZARD_ID,
} from 'src/core/constants';
import { Game, Profile } from 'src/core/entities';
import { getCaption, getMeMarkup } from 'src/core/utils';
import { MessageContext } from 'src/types/telegraf';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/reports';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { Markup } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

import { AppUpdate } from '../app.update';

describe('AppUpdate', () => {
  let update: AppUpdate;
  let replyUseCases: ReplyUseCases;
  let gameUseCases: GameUseCases;
  let reportUseCases: ReportUseCases;
  let profileUseCases: ProfileUseCases;

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
        {
          provide: ReportUseCases,
          useValue: createMock<ReportUseCases>(),
        },
        {
          provide: ProfileUseCases,
          useValue: createMock<ProfileUseCases>(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: createMock<Cache>(),
        },
      ],
    }).compile();

    update = module.get<AppUpdate>(AppUpdate);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
    gameUseCases = module.get<GameUseCases>(GameUseCases);
    reportUseCases = module.get<ReportUseCases>(ReportUseCases);
    profileUseCases = module.get<ProfileUseCases>(ProfileUseCases);
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
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onStart(ctx, undefined);

      expect(ctx.scene.enter).toHaveBeenCalledWith(CHANGE_LANG_WIZARD_ID);
    });

    it('should not create a new user if one already exists in the session', async () => {
      const ctx = createMock<MessageContext>({
        session: {},
      });

      const resp = await update.onStart(ctx, createMock<Profile>());

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
        replyWithPhoto: jest.fn(),
      });
      const profile = createMock<Profile>({
        fileId: '1234',
        games: [
          createMock<Game>({
            title: 'Test',
          }),
          createMock<Game>({
            title: 'Test2',
          }),
        ],
      });

      await update.onMe(ctx, profile);

      expect(ctx.replyWithPhoto).toHaveBeenCalledWith(profile.fileId, {
        caption: getCaption(profile),
        reply_markup: getMeMarkup(
          replyUseCases.translate('messages.profile.update', profile.user.lang),
        ),
      });
    });
  });

  describe('onSendMessage', () => {
    it('should enter the send message wizard', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onSendMessage(ctx);

      expect(ctx.scene.enter).toHaveBeenCalledWith(SEND_MESSAGE_WIZARD_ID);
    });
  });

  describe('onUpdateProfile', () => {
    it('should reply with the update profile message', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
      });

      await update.onUpdateProfile(ctx);

      expect(ctx.scene.enter).toHaveBeenCalledWith(REGISTER_WIZARD_ID);
    });
  });

  describe('onSetReportsBranch', () => {
    it('should reply with the set reports branch message', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
      });

      const createReportsChannelSpy = jest
        .spyOn(reportUseCases, 'createReportChannel')
        .mockResolvedValueOnce(undefined);

      const response = await update.onSetReportsBranch(ctx);

      expect(createReportsChannelSpy).toHaveBeenCalledWith({
        id: ctx.chat.id,
      });
      expect(response).toEqual('messages.report.channel.ok');
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

  describe('onSentence', () => {
    it('should delete the user profile', async () => {
      const userId = 123;
      const ctx = createMock<MessageContext>({
        callbackQuery: {
          data: `sen-${userId}`,
        },
      });

      const deleteByUserSpy = jest
        .spyOn(profileUseCases, 'deleteByUser')
        .mockResolvedValueOnce(undefined);

      await update.onSentence(ctx);

      expect(deleteByUserSpy).toHaveBeenCalledWith(userId);
      expect(replyUseCases.sendMsgToChatI18n).toHaveBeenCalledWith(
        userId,
        'messages.profile.deleted',
      );
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
          reply_markup: Keyboards.profiles,
        },
      );
      expect(ctx.scene.enter).toHaveBeenCalledWith(PROFILES_WIZARD_ID);
    });
  });

  describe('onInlineQuery', () => {
    it('should reply with the inline query results', async () => {
      const games = [
        createMock<Game>({
          description: "Test1's description",
          id: 1,
          image: "Test1's image",
          title: 'Test1',
        }),
        createMock<Game>({
          description: "Test2's description",
          id: 2,
          image: "Test2's image",
          title: 'Test2',
        }),
        createMock<Game>({
          description: "Test3's description",
          id: 3,
          image: "Test3's image",
          title: 'Test3',
        }),
        createMock<Game>({
          description: "Test4's description",
          id: 4,
          image: "Test4's image",
          title: 'Test4',
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
            description: game.description,
            id: game.id.toString(),
            input_message_content: {
              message_text: game.title,
            },
            thumbnail_url: game.image,
            title: game.title,
            type: 'article',
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
