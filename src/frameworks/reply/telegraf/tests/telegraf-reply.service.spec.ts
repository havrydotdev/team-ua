import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PathImpl2 } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/core/entities';
import { getProfileCacheKey } from 'src/core/utils';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Extra, Language, MessageContext } from 'src/types';
import { Telegraf } from 'telegraf';

import { TelegrafReplyService } from '../telegraf-reply.service';

describe('TelegrafReplyService', () => {
  let service: TelegrafReplyService;
  let i18n: jest.Mocked<I18nService<I18nTranslations>>;
  let bot: jest.Mocked<Telegraf<MessageContext>>;
  let cache: jest.Mocked<Cache>;
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
    const { unit, unitRef } = TestBed.create(TelegrafReplyService)
      .mock('DEFAULT_BOT_NAME')
      .using(
        createMock<Telegraf<MessageContext>>({
          telegram: {
            sendMessage: jest.fn(),
            sendPhoto: jest.fn(),
          },
        }),
      )
      .compile();

    service = unit;
    i18n = unitRef.get<I18nService<I18nTranslations>>(I18nService);
    bot = unitRef.get<Telegraf<MessageContext>>('DEFAULT_BOT_NAME');
    cache = unitRef.get<Cache>(CACHE_MANAGER);
  });

  it('should reply with a message', async () => {
    const msgCode: PathImpl2<I18nTranslations> = 'commands.help';
    const message = 'This is a test message';
    const extra: Extra = {};

    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValue(
      createMock<User>({
        lang: Language.UA,
      }),
    );
    const i18nSpy = jest.spyOn(i18n, 't').mockReturnValue(message);
    const sendMsgToChatSpy = jest.spyOn(service, 'sendMsgToChat');

    await service.reply(ctx, msgCode, extra);

    expect(cacheSpy).toHaveBeenCalledWith(getProfileCacheKey(ctx.from.id));
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
