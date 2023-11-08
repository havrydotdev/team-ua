import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { MAIN_MENU_MARKUP } from 'src/core/constants';
import { MessageContext } from 'src/types';

import { NextActionWizard } from '../next.wizard';

describe('NextActionWizard', () => {
  let wizard: NextActionWizard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NextActionWizard],
    }).compile();

    wizard = module.get<NextActionWizard>(NextActionWizard);
  });

  describe('onEnter', () => {
    it('should leave the scene and return the next action message', async () => {
      const ctx = createMock<MessageContext>({
        scene: {
          leave: jest.fn(),
        },
      });

      const result = await wizard.onEnter(ctx);

      expect(ctx.scene.leave).toHaveBeenCalled();
      expect(result).toEqual([
        'messages.next_action',
        {
          reply_markup: MAIN_MENU_MARKUP,
        },
      ]);
    });
  });
});
