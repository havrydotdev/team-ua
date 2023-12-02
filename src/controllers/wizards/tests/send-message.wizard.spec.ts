import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { WizardContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';

import { SendMessageWizard } from '../send-message.wizard';

describe('SendMessageWizard', () => {
  let wizard: SendMessageWizard;
  let profileUseCases: ProfileUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageWizard,
        {
          provide: ProfileUseCases,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([
                { user: { id: 'test1' } },
                { user: { id: 'test2' } },
              ]),
          },
        },
      ],
    }).compile();

    wizard = module.get<SendMessageWizard>(SendMessageWizard);
    profileUseCases = module.get<ProfileUseCases>(ProfileUseCases);
  });

  describe('onEnter', () => {
    it('should advance the wizard and return the expected message', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });
      const profile = createMock<Profile>({
        user: {
          role: 'admin',
        },
      });

      const result = await wizard.onEnter(ctx, profile);

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toEqual('messages.send_message.enter');
    });

    it('should throw an error when the user is not an admin', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });
      const profile = createMock<Profile>({
        user: {
          role: 'user',
        },
      });

      expect(wizard.onEnter(ctx, profile)).rejects.toThrowError(
        new BotException('errors.forbidden'),
      );
    });
  });

  describe('onLang', () => {
    it('should send a message to all profiles', async () => {
      const ctx = createMock<WizardContext>({
        scene: {
          leave: jest.fn(),
        },
        telegram: {
          sendMessage: jest.fn(),
        },
      });
      const msg = { text: 'test' };

      await wizard.onLang(ctx, msg);

      expect(profileUseCases.findAll).toHaveBeenCalled();
      expect(ctx.telegram.sendMessage).toHaveBeenCalledTimes(2);
      expect(ctx.telegram.sendMessage).toHaveBeenCalledWith('test1', 'test');
      expect(ctx.telegram.sendMessage).toHaveBeenCalledWith('test2', 'test');
    });
  });
});
