import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { REGISTER_WIZARD_ID } from 'src/core/constants';
import { Language } from 'src/core/enums';
import { getSelectLangMarkup } from 'src/core/utils';
import { WizardContext } from 'src/types';
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
        session: {
          user: {},
        },
      });

      const result = wizard.onEnter(ctx);

      expect(result).toEqual([
        'messages.select_lang',
        { reply_markup: getSelectLangMarkup() },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });

    it('should return the update language message with the select language markup', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
        session: {
          user: {
            profile: {},
          },
        },
      });

      const result = wizard.onEnter(ctx);

      expect(result).toEqual([
        'messages.update_lang',
        { reply_markup: getSelectLangMarkup() },
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
        {
          input: '🇷🇺',
          language: Language.RU,
        },
      ].forEach(async (testCase) => {
        const ctx = createMock<WizardContext>({
          session: {
            user: {},
          },
          scene: {
            leave: jest.fn(),
            enter: jest.fn(),
          },
        });

        await wizard.onLang(ctx, { text: testCase.input });

        expect(ctx.session.lang).toEqual(testCase.language);
        expect(ctx.scene.leave).toHaveBeenCalled();
        expect(ctx.scene.enter).toHaveBeenCalledWith(REGISTER_WIZARD_ID);
      });
    });

    it('should not enter register scene if profile is defined', async () => {
      const ctx = createMock<WizardContext>({
        session: {
          user: {
            profile: {},
          },
        },
        scene: {
          leave: jest.fn(),
          enter: jest.fn(),
        },
      });
      const msg = { text: '🇺🇦' };

      await wizard.onLang(ctx, msg);

      expect(ctx.session.lang).toEqual(Language.UA);
      expect(ctx.scene.leave).toHaveBeenCalled();
    });

    it('should return the invalid lang message for an invalid language', async () => {
      const ctx = createMock<WizardContext>({
        session: {},
        scene: {
          leave: jest.fn(),
        },
      });
      const msg = { text: 'invalid' };

      const result = await wizard.onLang(ctx, msg);

      expect(result).toEqual('messages.invalid_lang');
      expect(ctx.session.lang).toBeUndefined();
      expect(ctx.scene.leave).not.toHaveBeenCalled();
    });
  });
});