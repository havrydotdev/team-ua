import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  NEXT_WIZARD_ID,
  PROFILES_WIZARD_ID,
} from 'src/core/constants';
import { Profile } from 'src/core/entities';
import { getCaption, getProfileMarkup } from 'src/core/utils';
import { ProfilesWizardContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/reports';
import { deunionize } from 'telegraf';
import { ChatFromGetChat } from 'telegraf/typings/core/types/typegram';

import { ProfilesWizard } from '../profiles.wizard';

jest.mock('telegraf', () => {
  const originalModule = jest.requireActual('telegraf');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    deunionize: jest.fn(),
  };
});

describe('ProfilesWizard', () => {
  let wizard: ProfilesWizard;
  let profileUseCases: ProfileUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesWizard,
        {
          provide: ProfileUseCases,
          useValue: createMock<ProfileUseCases>(),
        },
        {
          provide: ReplyUseCases,
          useValue: createMock<ReplyUseCases>(),
        },
        {
          provide: ReportUseCases,
          useValue: createMock<ReportUseCases>(),
        },
      ],
    }).compile();

    wizard = module.get<ProfilesWizard>(ProfilesWizard);
    profileUseCases = module.get<ProfileUseCases>(ProfileUseCases);
  });

  describe('onEnter', () => {
    it('should set the current profile state and return message with url', async () => {
      (deunionize as jest.Mock).mockReturnValue({
        username: 'test',
      });

      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
        session: {},
        telegram: {
          getChat: jest
            .fn()
            .mockResolvedValueOnce(createMock<ChatFromGetChat>()),
        },
        wizard: {
          next: jest.fn(),
          state: {},
        },
      });
      const recommended = createMock<Profile>({
        fileId: '12345',
        games: [],
        id: 1,
        name: 'test',
      });

      const findSpy = jest
        .spyOn(profileUseCases, 'findRecommended')
        .mockResolvedValueOnce(recommended);
      await wizard.onEnter(ctx, createMock<Profile>({}));

      expect(findSpy).toHaveBeenCalledWith({}, ctx.session.seenProfiles);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(ctx.replyWithPhoto).toHaveBeenCalledWith(recommended.fileId, {
        caption: getCaption(recommended),
        reply_markup: getProfileMarkup(`https://t.me/test`),
      });
    });
  });

  describe('onAction', () => {
    it('should leave the scene if message text equals LEAVE_PROFILES_CALLBACK', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const msg = {
        text: LEAVE_PROFILES_CALLBACK,
      };

      await wizard.onAction(ctx, msg);

      expect(ctx.scene.leave).toHaveBeenCalled();
      expect(ctx.scene.enter).toHaveBeenCalledWith(NEXT_WIZARD_ID);
    });

    it('should re-enter the scene if message text equals NEXT_PROFILE_CALLBACK', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const msg = {
        text: NEXT_PROFILE_CALLBACK,
      };

      await wizard.onAction(ctx, msg);

      expect(ctx.scene.leave).toHaveBeenCalled();
      expect(ctx.scene.enter).toHaveBeenCalledWith(PROFILES_WIZARD_ID);
    });
  });
});
