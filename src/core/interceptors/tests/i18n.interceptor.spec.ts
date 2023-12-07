import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { of } from 'rxjs';
import { Extra, MessageContext, MsgKey, MsgWithExtra } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Markup } from 'telegraf';

import { I18nInterceptor } from '../i18n.interceptor';

describe('I18nInterceptor', () => {
  let interceptor: I18nInterceptor;
  let replyUseCases: jest.Mocked<ReplyUseCases>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(I18nInterceptor).compile();

    interceptor = unit;
    replyUseCases = unitRef.get(ReplyUseCases);
  });

  describe('intercept', () => {
    it('should call replyI18n on the reply use cases with the message key for a string', async () => {
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of('messages.test'),
      });
      const tgCtx = createMock<MessageContext>({
        from: { id: 12345, username: 'test' },
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue(tgCtx),
        }),
      );

      const response = await interceptor.intercept(context, handler);

      response.subscribe({
        complete: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledTimes(1);
        },
        next: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
            tgCtx,
            'messages.test',
          );
        },
      });
    });

    it('should call replyI18n on the reply use cases with the message key and extra for an array', async () => {
      const controllerResp: [MsgKey, Extra] = [
        'commands.help',
        { reply_markup: Markup.removeKeyboard().reply_markup },
      ];
      const tgCtx = createMock<MessageContext>({
        from: { id: 12345, username: 'test' },
      });
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of(controllerResp),
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue(tgCtx),
        }),
      );
      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = await interceptor.intercept(context, handler);

      response.subscribe({
        complete: () => {
          expect(replySpy).toHaveBeenCalledTimes(1);
        },
        next: () => {
          expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
            {},
            ...controllerResp,
          );
        },
      });
    });

    it('should call replyI18n on the reply use cases with the message key and extra for a nested array', async () => {
      const controllerResp: MsgWithExtra[] = [
        [
          'commands.help',
          { reply_markup: Markup.removeKeyboard().reply_markup },
        ],
        [
          'commands.help',
          { reply_markup: Markup.removeKeyboard().reply_markup },
        ],
      ];
      const context = createMock<ExecutionContext>();
      const handler = createMock<CallHandler>({
        handle: () => of(controllerResp),
      });
      const tgCtx = createMock<MessageContext>({
        from: { id: 12345, username: 'test' },
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue(tgCtx),
        }),
      );
      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = await interceptor.intercept(context, handler);

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
      const tgCtx = createMock<MessageContext>({
        from: { id: 12345, username: 'test' },
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue(tgCtx),
        }),
      );
      const replySpy = jest
        .spyOn(replyUseCases, 'replyI18n')
        .mockImplementation();

      const response = await interceptor.intercept(ctx, next);

      response.subscribe({
        complete: () => {
          expect(replySpy).not.toHaveBeenCalled();
        },
      });
    });
  });
});
