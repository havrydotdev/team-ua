import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PathImpl2 } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Extra, Language, MessageContext } from 'src/types';
import { Telegraf } from 'telegraf';

import { TelegrafReplyService } from '../telegraf-reply.service';

describe('TelegrafReplyService', () => {
  let service: TelegrafReplyService;
  let i18n: I18nService<I18nTranslations>;
  let bot: Telegraf<MessageContext>;
  const ctx = createMock<MessageContext>({
    chat: {
      id: 12345,
    },
    from: {
      id: 12345,
    },
    telegram: {
      sendMessage: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegrafReplyService,
        {
          provide: I18nService,
          useValue: createMock<I18nService<I18nTranslations>>(),
        },
        {
          provide: 'DEFAULT_BOT_NAME',
          useValue: createMock<Telegraf<MessageContext>>({
            telegram: {
              sendMessage: jest.fn(),
              sendPhoto: jest.fn(),
            },
          }),
        },
        {
          provide: CACHE_MANAGER,
          useValue: createMock<Cache>(),
        },
      ],
    }).compile();

    service = module.get<TelegrafReplyService>(TelegrafReplyService);
    i18n = module.get<I18nService<I18nTranslations>>(I18nService);
    bot = module.get<Telegraf<MessageContext>>('DEFAULT_BOT_NAME');
  });

  it('should reply with a translated message', async () => {
    const msgCode: PathImpl2<I18nTranslations> = 'commands.help';
    const message = 'This is a test message';
    const extra: Extra = {};

    const i18nSpy = jest.spyOn(i18n, 't').mockReturnValue(message);
    const sendMsgToChatSpy = jest.spyOn(service, 'sendMsgToChat');

    await service.reply(ctx, msgCode, extra);

    expect(i18nSpy).toHaveBeenCalledWith(msgCode, {
      lang: Language.UA,
    });
    expect(sendMsgToChatSpy).toHaveBeenCalledWith(ctx.from.id, message, extra);
  });

  it('should send message to a chat', async () => {
    const chatId = 12345;
    const msg = 'This is a test message';
    const extra: Extra = {};

    await service.sendMsgToChat(chatId, msg, extra);

    expect(bot.telegram.sendMessage).toHaveBeenCalledWith(chatId, msg, extra);
  });

  it('should send photo to a chat', async () => {
    const chatId = 12345;
    const photo = 'https://example.com/photo.jpg';
    const extra: Extra = {};

    await service.sendPhotoToChat(chatId, photo, extra);

    expect(bot.telegram.sendPhoto).toHaveBeenCalledWith(chatId, photo, extra);
  });
});
