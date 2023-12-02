import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CLEAR_LAST_WIZARD_ID,
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  REPORT_CALLBACK,
} from 'src/core/constants';
import { Profile, User } from 'src/core/entities';
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
      const profile = createMock<Profile>();

      const findSpy = jest
        .spyOn(profileUseCases, 'findRecommended')
        .mockResolvedValueOnce(recommended);
      await wizard.onEnter(
        ctx,
        createMock<User>({
          profile,
        }),
      );

      expect(findSpy).toHaveBeenCalledWith(profile, ctx.session.seenProfiles);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(ctx.replyWithPhoto).toHaveBeenCalledWith(recommended.fileId, {
        caption: getCaption(recommended),
        reply_markup: getProfileMarkup(`https://t.me/test`),
      });
    });

    it('should set the current profile state and return message with url', async () => {
      (deunionize as jest.Mock).mockReturnValue({
        username: 'test',
      });

      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
      });
      const profile = createMock<Profile>();

      const findSpy = jest
        .spyOn(profileUseCases, 'findRecommended')
        .mockResolvedValueOnce(undefined);
      await wizard.onEnter(
        ctx,
        createMock<User>({
          profile,
        }),
      );

      expect(findSpy).toHaveBeenCalledWith(profile, ctx.session.seenProfiles);
      expect(ctx.scene.enter).toHaveBeenCalledWith(CLEAR_LAST_WIZARD_ID);
    });
  });

  describe('onAction', () => {
    it('should leave the scene if message text equals LEAVE_PROFILES_CALLBACK', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          leave: jest.fn(),
        },
      });
      const msg = {
        text: LEAVE_PROFILES_CALLBACK,
      };

      await wizard.onAction(ctx, msg);

      expect(ctx.scene.leave).toHaveBeenCalled();
    });

    it('should re-enter the scene if message text equals NEXT_PROFILE_CALLBACK', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          reenter: jest.fn(),
        },
      });
      const msg = {
        text: NEXT_PROFILE_CALLBACK,
      };

      await wizard.onAction(ctx, msg);

      expect(ctx.scene.reenter).toHaveBeenCalled();
    });

    it('should go to the next step if message text equals REPORT_CALLBACK', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        wizard: {
          next: jest.fn(),
        },
      });
      const msg = {
        text: REPORT_CALLBACK,
      };

      const response = await wizard.onAction(ctx, msg);

      expect(response).toEqual('messages.report.send');
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onReport', () => {
    it('should leave the scene and enter the next one', async () => {
      const ctx = createMock<ProfilesWizardContext>({
        scene: {
          enter: jest.fn(),
          leave: jest.fn(),
        },
        wizard: {
          state: {
            current: createMock<Profile>({
              user: {
                id: 1,
              },
            }),
          },
        },
      });

      await wizard.onReport(ctx, {
        text: 'test',
      });

      expect(ctx.scene.leave).toHaveBeenCalled();
    });
  });
});
