import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { File, Profile, User } from 'src/core/entities';
import { getCaption, getProfileMarkup } from 'src/core/utils';
import { ProfilesMessageContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';
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
      ],
    }).compile();

    wizard = module.get<ProfilesWizard>(ProfilesWizard);
    profileUseCases = module.get<ProfileUseCases>(ProfileUseCases);
  });

  describe('onEnter', () => {
    it('should leave the scene and enter the PROFILES_WIZARD_ID scene when the NEXT_PROFILE_CALLBACK is received', async () => {
      (deunionize as jest.Mock).mockReturnValue({
        username: 'test',
      });

      const ctx = createMock<ProfilesMessageContext>({
        scene: {
          leave: jest.fn(),
          enter: jest.fn(),
        },
        wizard: {
          state: {},
          next: jest.fn(),
        },
        session: {
          user: createMock<User>({
            profile: createMock<Profile>({
              id: 2,
              name: 'test2',
            }),
          }),
        },
        telegram: {
          getChat: jest
            .fn()
            .mockResolvedValueOnce(createMock<ChatFromGetChat>()),
        },
      });
      const recommended = createMock<Profile>({
        id: 1,
        name: 'test',
        file: createMock<File>({
          url: 'https://test.com',
        }),
        games: [],
      });

      const findSpy = jest
        .spyOn(profileUseCases, 'findRecommended')
        .mockResolvedValueOnce(recommended);
      await wizard.onEnter(ctx);

      expect(findSpy).toHaveBeenCalledWith(ctx.session.user.profile);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(ctx.replyWithPhoto).toHaveBeenCalledWith(
        {
          url: recommended.file.url,
        },
        {
          caption: getCaption(recommended),
          reply_markup: getProfileMarkup(`https://t.me/test`),
        },
      );
    });
  });
});
