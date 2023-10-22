import { Test, TestingModule } from '@nestjs/testing';
import { ChangeLangWizard } from '../change-lang.wizard';
import { Language } from 'src/core/enums';
import { getSelectLangMarkup } from 'src/core/utils';
import { WizardContext } from 'src/types';

describe('ChangeLangWizard', () => {
  let wizard: ChangeLangWizard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeLangWizard],
    }).compile();

    wizard = module.get<ChangeLangWizard>(ChangeLangWizard);
  });

  describe('onEnter', () => {
    it('should return the select language message with the select language markup', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
        },
      } as unknown as WizardContext;

      const result = wizard.onEnter(ctx);

      expect(result).toEqual([
        'messages.select_lang',
        { reply_markup: getSelectLangMarkup() },
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onLang', () => {
    it('should set the session language and return the lang changed message', async () => {
      const ctx = {
        session: {},
        scene: {
          leave: jest.fn(),
        },
      } as unknown as WizardContext;
      const msg = { text: '🇺🇦' };

      const result = await wizard.onLang(ctx, msg);

      expect(result).toEqual('messages.lang_changed');
      expect(ctx.session.lang).toEqual(Language.UA);
      expect(ctx.scene.leave).toHaveBeenCalled();
    });

    it('should return the invalid lang message for an invalid language', async () => {
      const ctx = {
        session: {},
        scene: {
          leave: jest.fn(),
        },
      } as unknown as WizardContext;
      const msg = { text: 'invalid' };

      const result = await wizard.onLang(ctx, msg);

      expect(result).toEqual('messages.invalid_lang');
      expect(ctx.session.lang).toBeUndefined();
      expect(ctx.scene.leave).not.toHaveBeenCalled();
    });
  });
});
