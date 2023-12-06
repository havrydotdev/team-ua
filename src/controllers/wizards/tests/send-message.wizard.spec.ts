import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Keyboards,
  NEXT_WIZARD_ID,
  SKIP_STEP_CALLBACK,
} from 'src/core/constants';
import { PhotoMessage, SendMessageWizardContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

import { SendMessageWizard } from '../send-message.wizard';

describe('SendMessageWizard', () => {
  let wizard: SendMessageWizard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMessageWizard,
        {
          provide: UserUseCases,
          useValue: createMock<UserUseCases>(),
        },
      ],
    }).compile();

    wizard = module.get<SendMessageWizard>(SendMessageWizard);
  });

  describe('onEnter', () => {
    it('should advance the wizard and return the expected message', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {},
        },
      });

      const result = await wizard.onEnter(ctx);

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toEqual([
        'messages.send_message.enter_ua',
        {
          reply_markup: Keyboards.remove,
        },
      ]);
      expect(ctx.wizard.state.message).not.toBeUndefined();
    });
  });

  describe('onUa', () => {
    it('should advance the wizard and return the expected message', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            message: {},
          },
        },
      });

      const result = await wizard.onUa(ctx, { text: 'text' });

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toEqual([
        'messages.send_message.enter_en',
        {
          reply_markup: Keyboards.skipStep,
        },
      ]);
      expect(ctx.wizard.state.message.ua).toEqual('text');
    });
  });

  describe('onEn', () => {
    it('should advance the wizard and return the expected message', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            message: {
              ua: 'ua',
            },
          },
        },
      });

      const result = await wizard.onEn(ctx, { text: 'text' });

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toEqual([
        'messages.send_message.photo',
        {
          reply_markup: Keyboards.skipStep,
        },
      ]);
      expect(ctx.wizard.state.message.en).toEqual('text');
    });

    it('should advance the wizard and return the expected message when skip step', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        wizard: {
          next: jest.fn(),
          state: {
            message: {
              ua: 'ua',
            },
          },
        },
      });

      const result = await wizard.onEn(ctx, {
        text: SKIP_STEP_CALLBACK,
      });

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(ctx.wizard.state.message.en).toEqual('ua');
    });
  });

  describe('onPhoto', () => {
    it('should advance the wizard and return the expected message', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        scene: {
          enter: jest.fn(),
        },
        wizard: {
          next: jest.fn(),
          state: {
            message: {
              en: 'en',
              ua: 'ua',
            },
          },
        },
      });

      const result = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: [],
        }),
      );

      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(result).toEqual('messages.send_message.sent');
      expect(ctx.wizard.state.photo).toEqual(undefined);
    });

    it('should advance the wizard and return the expected message when skip step', async () => {
      const ctx = createMock<SendMessageWizardContext>({
        scene: {
          enter: jest.fn(),
        },
        wizard: {
          next: jest.fn(),
          state: {
            message: {
              en: 'en',
              ua: 'ua',
            },
          },
        },
      });

      const result = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: undefined,
        }),
      );

      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(result).toEqual('messages.send_message.sent');
      expect(ctx.wizard.state.photo).toBeUndefined();
    });
  });
});
