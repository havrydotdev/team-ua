import { Test, TestingModule } from '@nestjs/testing';
import { I18nInterceptor } from '../i18n.interceptor';
import { ReplyUseCases } from 'src/use-cases/reply';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { createMock } from '@golevelup/ts-jest';
import { Markup } from 'telegraf';
import { MsgKey } from 'src/types';
import { Extra } from 'src/core/types';

describe('I18nInterceptor', () => {
  let interceptor: I18nInterceptor;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        I18nInterceptor,
        {
          provide: ReplyUseCases,
          useValue: {
            replyI18n: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<I18nInterceptor>(I18nInterceptor);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('intercept', () => {
    it('should call replyI18n on the reply use cases with the message key for a string', async () => {
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of('messages.test'),
      });

      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementationOnce(async () => {});

      const response = interceptor.intercept(context, handler);

      response.subscribe({
        next: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
            {},
            'messages.test',
          );
        },
        complete: () => {
          expect(replySpy).toHaveBeenCalledTimes(1);
        },
      });
    });

    it('should call replyI18n on the reply use cases with the message key and extra for an array', async () => {
      const controllerResp: [MsgKey, Extra] = [
        'messages.help',
        { reply_markup: Markup.removeKeyboard().reply_markup },
      ];

      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of(controllerResp),
      });

      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = interceptor.intercept(context, handler);

      response.subscribe({
        next: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
            {},
            ...controllerResp,
          );
        },
        complete: () => {
          expect(replySpy).toHaveBeenCalledTimes(1);
        },
      });
    });

    it('should call replyI18n on the reply use cases with the message key and extra for a nested array', async () => {
      const controllerResp: [[MsgKey, Extra], [MsgKey, Extra]] = [
        [
          'messages.help',
          { reply_markup: Markup.removeKeyboard().reply_markup },
        ],
        [
          'messages.help',
          { reply_markup: Markup.removeKeyboard().reply_markup },
        ],
      ];
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of(controllerResp),
      });

      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = interceptor.intercept(context, handler);

      response.subscribe({
        next: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
            {},
            ...controllerResp,
          );
        },
        complete: () => {
          expect(replySpy).toHaveBeenCalledTimes(1);
        },
      });
    });

    it('should not call replyI18n on the reply use cases for undefined', async () => {
      const ctx = {
        getArgByIndex: jest.fn().mockReturnValue({}),
      } as unknown as ExecutionContext;
      const next = { handle: jest.fn().mockReturnValue(of(undefined)) };
      jest.spyOn(replyUseCases, 'replyI18n').mockImplementation();

      await interceptor.intercept(ctx, next);

      expect(replyUseCases.replyI18n).not.toHaveBeenCalled();
    });
  });
});
