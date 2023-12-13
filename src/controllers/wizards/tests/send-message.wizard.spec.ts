import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
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
  let userUseCases: jest.Mocked<UserUseCases>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(SendMessageWizard).compile();

    wizard = unit;
    userUseCases = unitRef.get(UserUseCases);
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
        'messages.send_message.enter.ua',
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
        'messages.send_message.enter.en',
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

      const findSpy = jest.spyOn(userUseCases, 'findAll').mockResolvedValue([]);

      const result = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: [],
        }),
      );

      expect(findSpy).toHaveBeenCalled();
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

      const findSpy = jest.spyOn(userUseCases, 'findAll').mockResolvedValue([]);

      const result = await wizard.onPhoto(
        ctx,
        createMock<PhotoMessage>({
          photo: undefined,
        }),
      );

      expect(findSpy).toHaveBeenCalled();
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
      expect(result).toEqual('messages.send_message.sent');
      expect(ctx.wizard.state.photo).toBeUndefined();
    });
  });
});
