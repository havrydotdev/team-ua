import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { IProfileService } from 'src/core/abstracts';
import { CreateProfileDto } from 'src/core/dtos';
import { Profile } from 'src/core/entities';
import { ProfileFactoryService } from '../profile-factory.service';
import { ProfileUseCases } from '../profile.use-case';

describe('ProfileUseCases', () => {
  let useCases: ProfileUseCases;
  let service: IProfileService;
  let factory: ProfileFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileUseCases,
        {
          provide: IProfileService,
          useValue: createMock<IProfileService>(),
        },
        {
          provide: ProfileFactoryService,
          useValue: createMock<ProfileFactoryService>(),
        },
      ],
    }).compile();

    useCases = module.get<ProfileUseCases>(ProfileUseCases);
    service = module.get<IProfileService>(IProfileService);
    factory = module.get<ProfileFactoryService>(ProfileFactoryService);
  });

  it('should call findByUser on the profile service', async () => {
    const profile = createMock<Profile>({
      user: {
        id: 1,
      },
    });

    const findByUserSpy = jest
      .spyOn(service, 'findByUser')
      .mockResolvedValue(profile);

    const result = await useCases.findByUser(profile.user.id);

    expect(result).toEqual(profile);
    expect(findByUserSpy).toHaveBeenCalledWith(profile.user.id);
  });

  it('should call createProfile on the profile service with a new profile', async () => {
    const dto = createMock<CreateProfileDto>();
    const profile = createMock<Profile>();

    const createSpy = jest.spyOn(factory, 'create').mockReturnValue(profile);
    const createProfileSpy = jest
      .spyOn(service, 'createProfile')
      .mockResolvedValue(profile);

    const result = await useCases.create(dto);

    expect(result).toEqual(profile);
    expect(createSpy).toHaveBeenCalledWith(dto);
    expect(createProfileSpy).toHaveBeenCalledWith(profile);
  });

  it('should call updateProfile on the profile service with an updated profile', async () => {
    const profileId = 1;
    const dto = createMock<CreateProfileDto>();
    const profile = createMock<Profile>();

    const updateSpy = jest.spyOn(factory, 'update').mockReturnValue(profile);
    const updateProfileSpy = jest
      .spyOn(service, 'updateProfile')
      .mockResolvedValue(profile);

    const result = await useCases.updateProfile(profileId, dto);

    expect(result).toEqual(profile);
    expect(updateSpy).toHaveBeenCalledWith(dto);
    expect(updateProfileSpy).toHaveBeenCalledWith(profileId, profile);
  });

  it('should call deleteProfile on the profile service', async () => {
    const profileId = 1;

    const deleteProfileSpy = jest
      .spyOn(service, 'deleteProfile')
      .mockResolvedValue(undefined);

    await useCases.deleteProfile(profileId);

    expect(deleteProfileSpy).toHaveBeenCalledWith(profileId);
  });

  it('should call findByUser and findRecommended on the profile service', async () => {
    const recommended = createMock<Profile>({
      user: {
        id: 2,
        profile: createMock<Profile>(),
      },
    });
    const profile = createMock<Profile>({
      user: {
        id: 1,
        profile: createMock<Profile>(),
      },
    });

    const findRecommendedSpy = jest
      .spyOn(service, 'findRecommended')
      .mockResolvedValue(recommended);

    const result = await useCases.findRecommended(profile);

    expect(result).toEqual(recommended);
    expect(findRecommendedSpy).toHaveBeenCalledWith(profile);
  });
});
