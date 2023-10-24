import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Extra } from 'src/core/types';
import { MsgKey, MsgWithExtra } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Markup } from 'telegraf';
import { I18nInterceptor } from '../i18n.interceptor';

describe('I18nInterceptor', () => {
  let interceptor: I18nInterceptor;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        I18nInterceptor,
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
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
      const controllerResp: MsgWithExtra[] = [
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
          expect(replySpy).toHaveBeenCalledTimes(1);
        },
      });
    });

    it('should not call replyI18n on the reply use cases for undefined', async () => {
      const ctx = createMock<ExecutionContext>({
        getArgByIndex: jest.fn().mockReturnValue({}),
      });
      const next = createMock<CallHandler>({
        handle: jest.fn().mockReturnValue(of(undefined)),
      });

      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = interceptor.intercept(ctx, next);

      response.subscribe({
        complete: () => {
          expect(replySpy).not.toHaveBeenCalled();
        },
      });
    });
  });
});
