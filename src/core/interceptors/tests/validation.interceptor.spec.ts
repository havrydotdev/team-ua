import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/core/entities';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';
import { BotException } from '../../errors';
import { ContextInterceptor } from '../validation.interceptor';

describe('ContextInterceptor', () => {
  let interceptor: ContextInterceptor;
  let userUseCases: UserUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContextInterceptor,
        {
          provide: UserUseCases,
          useValue: createMock<UserUseCases>(),
        },
      ],
    }).compile();

    interceptor = module.get<ContextInterceptor>(ContextInterceptor);
    userUseCases = module.get<UserUseCases>(UserUseCases);
  });

  describe('intercept', () => {
    it('should throw a BotException for a non-private chat', async () => {
      const ctx = {
        getArgByIndex: jest.fn().mockReturnValue({
          chat: { type: 'group' },
        }),
      } as unknown as ExecutionContext;
      const next = { handle: jest.fn() };

      await expect(interceptor.intercept(ctx, next)).rejects.toThrow(
        BotException,
      );
    });

    it('should set the session user to an existing user and call next for a private chat with an existing user', async () => {
      const ctx = createMock<ExecutionContext>({
        getArgByIndex: jest.fn().mockReturnValue({
          chat: { type: 'private' },
          from: { id: 1 },
          session: { user: undefined },
        }),
      });
      const next = { handle: jest.fn().mockReturnValue(Promise.resolve()) };
      const user = createMock<User>({
        id: 1,
      });

      jest.spyOn(userUseCases, 'getByTgId').mockResolvedValue(user);

      await interceptor.intercept(ctx, next);

      expect(userUseCases.getByTgId).toHaveBeenCalledWith(1);
      expect((ctx.getArgByIndex(0) as MessageContext).session.user).toEqual(
        user,
      );
      expect(next.handle).toHaveBeenCalled();
    });

    it('should set the session user to a new user and call next for a private chat without an existing user', async () => {
      const ctx = createMock<ExecutionContext>({
        getArgByIndex: jest.fn().mockReturnValue({
          chat: { type: 'private', id: 1 },
          from: { id: 1 },
          session: { user: undefined },
        }),
      });
      const next = { handle: jest.fn().mockReturnValue(Promise.resolve()) };
      const user = createMock<User>({
        id: 1,
      });

      jest.spyOn(userUseCases, 'getByTgId').mockResolvedValue(undefined);
      jest.spyOn(userUseCases, 'create').mockResolvedValue(user);

      await interceptor.intercept(ctx, next);

      expect(userUseCases.getByTgId).toHaveBeenCalledWith(1);
      expect(userUseCases.create).toHaveBeenCalledWith({
        chatId: 1,
        userId: 1,
      });
      expect((ctx.getArgByIndex(0) as MessageContext).session.user).toEqual(
        user,
      );
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
