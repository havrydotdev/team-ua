import { Test, TestingModule } from '@nestjs/testing';
import { AppUpdate } from '../app.update';
import { UserUseCases } from 'src/use-cases/user/user.use-case';
import { ReplyUseCases } from 'src/use-cases/reply';
import { MessageContext } from 'src/types/telegraf';
import { User } from 'src/core';
import { REGISTER_WIZARD_ID } from 'src/core/constants';

describe('AppUpdate', () => {
  let update: AppUpdate;
  let userUseCases: UserUseCases;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppUpdate,
        {
          provide: UserUseCases,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ReplyUseCases,
          useValue: {
            startCommandMessage: jest.fn(),
            languageChanged: jest.fn(),
            newUser: jest.fn(),
          },
        },
      ],
    }).compile();

    update = module.get<AppUpdate>(AppUpdate);
    userUseCases = module.get<UserUseCases>(UserUseCases);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('onStart', () => {
    it('should create a new user if one does not exist in the session', async () => {
      const chatId = 123;
      const userId = 456;

      const ctx = {
        chat: {
          id: chatId,
        },
        from: {
          id: userId,
        },
        session: {},
      } as MessageContext;

      const user = {
        id: 1,
      } as User;

      jest.spyOn(userUseCases, 'create').mockResolvedValue(user);

      jest
        .spyOn(replyUseCases, 'startCommandMessage')
        .mockResolvedValue(undefined);

      await update.onStart(ctx);

      expect(userUseCases.create).toHaveBeenCalledWith({
        chatId,
        userId,
      });
      expect(ctx.session.user).toEqual(user);
      expect(replyUseCases.startCommandMessage).toHaveBeenCalledWith(ctx);
    });

    it('should not create a new user if one already exists in the session', async () => {
      const user = {
        id: 1,
      } as User;
      const ctx = {
        session: {
          user,
        },
      } as MessageContext;

      await update.onStart(ctx);

      expect(userUseCases.create).not.toHaveBeenCalled();
      expect(ctx.session.user).toEqual(user);
      expect(replyUseCases.startCommandMessage).toHaveBeenCalledWith(ctx);
    });
  });

  describe('onLang', () => {
    it('should call startCommandMessage on the reply use cases', async () => {
      const ctx = {
        session: {},
        scene: {
          enter: jest.fn(),
        },
      } as unknown as MessageContext;
      const msg = { text: '🇺🇦' };

      await update.onLang(ctx, msg);

      expect(ctx.scene.enter).toHaveBeenCalledWith(REGISTER_WIZARD_ID);
    });
  });
});
