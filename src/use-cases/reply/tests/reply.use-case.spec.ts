import { Test, TestingModule } from '@nestjs/testing';
import { ReplyUseCases } from '../reply.use-case';
import { IReplyService } from 'src/core';
import { Context } from 'telegraf';
import { MsgKey } from 'src/types';
import { Extra } from 'src/core/types';
import { getRemoveKeyboardMarkup } from 'src/core/utils';

describe('ReplyUseCases', () => {
  let useCases: ReplyUseCases;
  let replyService: IReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyUseCases,
        {
          provide: IReplyService,
          useValue: {
            reply: jest.fn(),
          },
        },
      ],
    }).compile();

    useCases = module.get<ReplyUseCases>(ReplyUseCases);
    replyService = module.get<IReplyService>(IReplyService);
  });

  describe('replyI18n', () => {
    it('should call reply on the reply service with the correct arguments', async () => {
      const ctx = {} as Context;
      const key: MsgKey = 'messages.enter_age';
      const params: Extra = {
        reply_markup: getRemoveKeyboardMarkup(),
      };

      await useCases.replyI18n(ctx, key, params);

      expect(replyService.reply).toHaveBeenCalledWith(ctx, key, params);
    });
  });
});
