import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { IReplyService } from 'src/core/abstracts';
import { Extra } from 'src/core/types';
import { getRemoveKeyboardMarkup } from 'src/core/utils';
import { MsgKey } from 'src/types';
import { Context } from 'telegraf';
import { ReplyUseCases } from '../reply.use-case';

describe('ReplyUseCases', () => {
  let useCases: ReplyUseCases;
  let replyService: IReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyUseCases,
        {
          provide: IReplyService,
          useValue: createMock<IReplyService>(),
        },
      ],
    }).compile();

    useCases = module.get<ReplyUseCases>(ReplyUseCases);
    replyService = module.get<IReplyService>(IReplyService);
  });

  describe('replyI18n', () => {
    it('should call reply on the reply service with the correct arguments', async () => {
      const ctx = createMock<Context>();
      const key: MsgKey = 'messages.enter_age';
      const params: Extra = {
        reply_markup: getRemoveKeyboardMarkup(),
      };

      await useCases.replyI18n(ctx, key, params);

      expect(replyService.reply).toHaveBeenCalledWith(ctx, key, params);
    });
  });
});
