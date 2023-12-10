import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { Keyboards } from 'src/core/constants';
import { MessageContext } from 'src/types';

import { NextActionWizard } from '../next.wizard';

describe('NextActionWizard', () => {
  let wizard: NextActionWizard;

  beforeEach(async () => {
    const { unit } = TestBed.create(NextActionWizard).compile();

    wizard = unit;
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
          reply_markup: Keyboards.mainMenu,
        },
      ]);
    });
  });
});
