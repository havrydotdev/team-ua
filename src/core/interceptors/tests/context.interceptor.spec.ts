import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { User } from 'src/core/entities';
import { UserUseCases } from 'src/use-cases/user';
import { ContextInterceptor } from '../context.interceptor';

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
    it('should set the session user to an existing user and call next', async () => {
      const next = { handle: jest.fn().mockReturnValue(Promise.resolve()) };
      const user = createMock<User>({
        id: 1,
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue({
            from: { id: 12345 },
            session: {
              user: undefined,
            },
          }),
        }),
      );
      jest.spyOn(userUseCases, 'findById').mockResolvedValue(user);

      await interceptor.intercept(createMock<ExecutionContext>(), next);

      expect(userUseCases.findById).toHaveBeenCalledWith(12345);
      expect(next.handle).toHaveBeenCalled();
    });

    it('should set the session user to a new user and call next for a private chat without an existing user', async () => {
      const ctx = createMock<ExecutionContext>({
        getArgByIndex: jest.fn().mockReturnValue({
          from: { id: 12345 },
          session: { user: undefined },
        }),
      });
      const next = { handle: jest.fn().mockReturnValue(Promise.resolve()) };
      const user = createMock<User>({
        id: 1,
      });

      jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
        createMock<TelegrafExecutionContext>({
          getContext: jest.fn().mockReturnValue({
            from: { id: 12345 },
            session: {
              user: undefined,
            },
          }),
        }),
      );
      jest.spyOn(userUseCases, 'findById').mockResolvedValue(undefined);
      jest.spyOn(userUseCases, 'create').mockResolvedValue(user);

      await interceptor.intercept(ctx, next);

      expect(userUseCases.findById).toHaveBeenCalledWith(12345);
      expect(userUseCases.create).toHaveBeenCalledWith({
        id: 12345,
      });
      expect(next.handle).toHaveBeenCalled();
    });
  });
});
