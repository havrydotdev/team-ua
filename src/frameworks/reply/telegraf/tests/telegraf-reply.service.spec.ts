import { Test, TestingModule } from '@nestjs/testing';
import { TelegrafReplyService } from '../telegraf-reply.service';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Context } from 'telegraf/typings';
import { Extra } from 'src/core/types';
import { PathImpl2 } from '@nestjs/config';
import { Language } from 'src/core/enums';

describe('TelegrafReplyService', () => {
  let service: TelegrafReplyService;
  let i18n: I18nService<I18nTranslations>;
  const ctx = {
    session: {
      lang: Language.UA,
    },
    reply: jest.fn(),
  } as unknown as Context;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegrafReplyService,
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TelegrafReplyService>(TelegrafReplyService);
    i18n = module.get<I18nService<I18nTranslations>>(I18nService);
  });

  it('should reply with a translated message', async () => {
    const msgCode: PathImpl2<I18nTranslations> = 'messages.help';
    const message = 'This is a test message';
    const extra: Extra = {};

    jest.spyOn(i18n, 't').mockReturnValue(message);

    await service.reply(ctx, msgCode, extra);

    expect(i18n.t).toHaveBeenCalledWith(msgCode, {
      lang: Language.UA,
    });
    expect(ctx.reply).toHaveBeenCalledWith(message, extra);
  });
});
