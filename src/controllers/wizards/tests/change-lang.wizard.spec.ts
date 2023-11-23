import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Keyboards, REGISTER_WIZARD_ID } from 'src/core/constants';
import { Profile } from 'src/core/entities';
import { Language, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { ChangeLangWizard } from '../change-lang.wizard';

describe('ChangeLangWizard', () => {
  let wizard: ChangeLangWizard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeLangWizard,
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
      ],
    }).compile();

    wizard = module.get<ChangeLangWizard>(ChangeLangWizard);
  });

  describe('onEnter', () => {
    it('should return the select language message with the select language markup if profile is undefined', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });

      const result = await wizard.onEnter(ctx, undefined);

      expect(result).toEqual([
        'messages.lang.select',
        { reply_markup: Keyboards.selectLang },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });

    it('should return the update language message with the select language markup', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });

      const result = await wizard.onEnter(ctx, createMock<Profile>());

      expect(result).toEqual([
        'messages.lang.update',
        { reply_markup: Keyboards.selectLang },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onLang', () => {
    it('should enter register scene if profile is undefined', async () => {
      [
        {
          input: '🇺🇦',
          language: Language.UA,
        },
        {
          input: '🇬🇧',
          language: Language.EN,
        },
      ].forEach(async (testCase) => {
        const ctx = createMock<WizardContext>({
          scene: {
            enter: jest.fn(),
            leave: jest.fn(),
          },
        });

        await wizard.onLang(ctx, { text: testCase.input }, undefined);

        expect(ctx.session.lang).toEqual(testCase.language);
        expect(ctx.scene.leave).toHaveBeenCalled();
        expect(ctx.scene.enter).toHaveBeenCalledWith(REGISTER_WIZARD_ID);
      });
    });

    it('should not enter register scene if profile is defined', async () => {
      const ctx = createMock<WizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const msg = { text: '🇺🇦' };

      await wizard.onLang(ctx, msg, createMock<Profile>({}));

      expect(ctx.session.lang).toEqual(Language.UA);
      expect(ctx.scene.leave).toHaveBeenCalled();
    });

    it('should return the invalid lang message for an invalid language', async () => {
      const ctx = createMock<WizardContext>({
        scene: {
          leave: jest.fn(),
        },
      });
      const msg = { text: 'invalid' };

      const result = await wizard.onLang(ctx, msg, undefined);

      expect(result).toEqual('messages.lang.invalid');
      expect(ctx.session.lang).toBeUndefined();
      expect(ctx.scene.leave).not.toHaveBeenCalled();
    });
  });
});
