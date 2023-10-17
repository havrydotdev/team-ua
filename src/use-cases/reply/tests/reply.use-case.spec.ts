import { Context, Markup } from 'telegraf';
import { ReplyUseCases } from '../reply.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { IReplyService } from 'src/core';
import { I18nModule } from 'src/services/i18n/i18n.module';
import { ConfigModule } from '@nestjs/config';
import { Language } from 'src/core/enums';

describe('ReplyUseCases', () => {
  let useCases: ReplyUseCases;
  let ctx: Context;
  let service: IReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        ReplyUseCases,
        {
          provide: IReplyService,
          useValue: {
            reply: jest.fn().mockImplementation(() => Promise.resolve()),
            translate: jest.fn().mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    useCases = module.get<ReplyUseCases>(ReplyUseCases);
    service = module.get<IReplyService>(IReplyService);

    ctx = {
      session: {
        lang: Language.UA,
      },
      from: {
        first_name: 'test',
      },
    } as Context;
  });

  describe('enterName', () => {
    it('should send enter_name message with resize_keyboard and one_time_keyboard options', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.enterName(ctx);

      const fullName = `${ctx.from.first_name}`;

      const reply_markup = Markup.keyboard([
        [Markup.button.callback(fullName, fullName)],
      ]).reply_markup;

      // resize keyboard to fit screen
      reply_markup.resize_keyboard = true;

      // hide keyboard after user enters name
      reply_markup.one_time_keyboard = true;

      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.enter_name', {
        reply_markup,
      });
    });
  });

  describe('enterAge', () => {
    jest.useFakeTimers();

    it('should send enter_age message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.enterAge(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.enter_age');
    });
  });

  describe('invalidAge', () => {
    jest.useFakeTimers();

    it('should send invalid_age message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.invalidAge(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.invalid_age');
    });
  });

  describe('sendLocation', () => {
    jest.useFakeTimers();

    it('should send send_location message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.sendLocation(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_location');
    });
  });

  describe('sendPicture', () => {
    jest.useFakeTimers();

    it('should send send_picture message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.sendPicture(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_picture');
    });
  });

  describe('sendGames', () => {
    jest.useFakeTimers();

    it('should send send_games message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.sendGames(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_games');
    });
  });

  describe('invalidGame', () => {
    jest.useFakeTimers();

    it('should send invalid_game message', async () => {
      const replySpy = jest.spyOn(service, 'reply');
      await useCases.invalidGame(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.invalid_game');
    });
  });
});
