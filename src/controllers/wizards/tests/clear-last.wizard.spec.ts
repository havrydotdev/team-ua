import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CLEAR_LAST_YES_CALLBACK, Keyboards } from 'src/core/constants';
import { MessageContext, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { ClearLastProfilesWizard } from '../clear-last.wizard';

describe('ClearLastProfilesWizard', () => {
  let wizard: ClearLastProfilesWizard;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClearLastProfilesWizard,
        {
          provide: ReplyUseCases,
          useValue: {
            replyI18n: jest.fn(),
          },
        },
      ],
    }).compile();

    wizard = module.get<ClearLastProfilesWizard>(ClearLastProfilesWizard);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('onEnter', () => {
    it('should advance the wizard and return the expected messages', () => {
      const ctx = createMock<WizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });

      const result = wizard.onEnter(ctx);

      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(result).toEqual([
        [
          'messages.profile.last.no_more',
          {
            reply_markup: Keyboards.remove,
          },
        ],
        [
          'messages.profile.last.clear',
          {
            reply_markup: Keyboards.clearLast,
          },
        ],
      ]);
    });
  });

  describe('onAnswer', () => {
    it('should clear the seenProfiles and reply with the cleared message when the CLEAR_LAST_YES_CALLBACK is received', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          enter: jest.fn(),
        },
        session: {
          seenProfiles: [1, 2],
        },
      });
      const msg = { text: CLEAR_LAST_YES_CALLBACK };

      await wizard.onAnswer(ctx, msg);

      expect(ctx.session.seenProfiles).toEqual([]);
      expect(replyUseCases.replyI18n).toHaveBeenCalledWith(
        ctx,
        'messages.profile.last.cleared',
        {
          reply_markup: Keyboards.remove,
        },
      );
    });
  });
});
