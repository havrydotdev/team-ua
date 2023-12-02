import { createMock } from '@golevelup/ts-jest';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { NEXT_WIZARD_ID } from 'src/core/constants';
import { MessageContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { BaseScene } from 'telegraf/typings/scenes';

import { UnexpectedExceptionFilter } from '../global.filter';

describe('GlobalFilter', () => {
  let filter: UnexpectedExceptionFilter;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnexpectedExceptionFilter,
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
      ],
    }).compile();

    filter = module.get<UnexpectedExceptionFilter>(UnexpectedExceptionFilter);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('catch', () => {
    it('should leave current scene if it exists', () => {
      const exception = new Error();
      const ctx = createMock<MessageContext>({
        scene: {
          current: createMock<BaseScene>(),
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const host = createMock<ArgumentsHost>();

      const createSpy = jest
        .spyOn(TelegrafArgumentsHost, 'create')
        .mockReturnValue(
          createMock<TelegrafArgumentsHost>({
            getContext: () => ctx,
          }),
        );

      filter.catch(exception, host);

      expect(createSpy).toHaveBeenCalledWith(host);
      expect(ctx.scene.leave).toHaveBeenCalled();
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctx,
        'errors.unknown',
      );
    });

    it('should not leave current scene if it does not exists', () => {
      const exception = new Error();
      const ctx = createMock<MessageContext>({
        scene: {
          current: undefined,
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const host = createMock<ArgumentsHost>();

      const createSpy = jest
        .spyOn(TelegrafArgumentsHost, 'create')
        .mockReturnValue(
          createMock<TelegrafArgumentsHost>({
            getContext: () => ctx,
          }),
        );

      filter.catch(exception, host);

      expect(createSpy).toHaveBeenCalledWith(host);
      expect(ctx.scene.leave).not.toHaveBeenCalled();
      expect(ctx.scene.enter).not.toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctx,
        'errors.unknown',
      );
    });
  });
});
