import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Keyboards, REGISTER_WIZARD_ID } from 'src/core/constants';
import { User } from 'src/core/entities';
import { Language, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { UserUseCases } from 'src/use-cases/user';

import { ChangeLangWizard } from '../change-lang.wizard';

describe('ChangeLangWizard', () => {
  let wizard: ChangeLangWizard;
  let userUseCases: UserUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeLangWizard,
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
        {
          provide: UserUseCases,
          useValue: createMock<UserUseCases>(),
        },
      ],
    }).compile();

    wizard = module.get<ChangeLangWizard>(ChangeLangWizard);
    userUseCases = module.get<UserUseCases>(UserUseCases);
  });

  describe('onEnter', () => {
    it('should return the select language message with the select language markup if profile is undefined', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });

      const result = await wizard.onEnter(
        ctx,
        createMock<User>({
          profile: undefined,
        }),
      );

      expect(result).toEqual([
        ['commands.start', {}],
        ['messages.lang.select', { reply_markup: Keyboards.selectLang }],
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });

    it('should return the update language message with the select language markup', async () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });

      const result = await wizard.onEnter(ctx, createMock<User>({}));

      expect(result).toEqual([
        ['messages.lang.update', { reply_markup: Keyboards.selectLang }],
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
          message: {
            from: {
              id: 1234,
            },
          },
          scene: {
            enter: jest.fn(),
            leave: jest.fn(),
          },
        });

        await wizard.onLang(
          ctx,
          { text: testCase.input },
          createMock<User>({
            profile: undefined,
          }),
        );

        expect(ctx.scene.leave).toHaveBeenCalled();
        expect(ctx.scene.enter).toHaveBeenCalledWith(REGISTER_WIZARD_ID);
        expect(userUseCases.update).toHaveBeenCalledWith(
          createMock<User>({
            id: ctx.message.from.id,
            lang: testCase.language,
          }),
        );
      });
    });

    it('should not enter register scene if profile is defined', async () => {
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
          message: {
            from: {
              id: 1234,
            },
          },
          scene: {
            enter: jest.fn(),
            leave: jest.fn(),
          },
        });
        const msg = { text: testCase.input };

        await wizard.onLang(ctx, msg, createMock<User>({}));

        expect(userUseCases.update).toHaveBeenCalledWith(
          createMock<User>({
            id: ctx.message.from.id,
            lang: testCase.language,
          }),
        );
        expect(ctx.scene.leave).toHaveBeenCalled();
      });
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
      expect(ctx.scene.leave).not.toHaveBeenCalled();
    });
  });
});
