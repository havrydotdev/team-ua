import { createMock } from '@golevelup/ts-jest';
import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { UnexpectedExceptionFilter } from '../global.filter';

describe('GlobalFilter', () => {
  let filter: UnexpectedExceptionFilter;
  let replyUseCases: ReplyUseCases;
  const ctxMock = createMock<MessageContext>();
  const host = createMock<ArgumentsHost>({
    getArgByIndex: jest.fn().mockReturnValue(ctxMock),
  });

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
    it('should call replyI18n with the default error message for an unknown exception', () => {
      const exception = new Error();
      filter.catch(exception, host);

      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctxMock,
        'errors.unknown',
      );
    });
  });
});
