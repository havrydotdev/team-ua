import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
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
    const { unit, unitRef } = TestBed.create(ProfileUseCases).compile();

    useCases = unit;
    // @ts-expect-error - abstract class
    service = unitRef.get(IProfileService);
    factory = unitRef.get(ProfileFactoryService);
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

    const result = await useCases.update(profileId, dto);

    expect(result).toEqual(profile);
    expect(updateSpy).toHaveBeenCalledWith(dto);
    expect(updateProfileSpy).toHaveBeenCalledWith(profileId, profile);
  });

  it('should call deleteByUser on the profile service', async () => {
    const userId = 1;

    const deleteByUserSpy = jest.spyOn(service, 'deleteByUser');

    await useCases.deleteByUser(userId);

    expect(deleteByUserSpy).toHaveBeenCalledWith(userId);
  });

  it('should call findAll on the profile service', async () => {
    const profiles = [createMock<Profile>()];

    const findAllSpy = jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(profiles);

    const result = await useCases.findAll();

    expect(result).toEqual(profiles);
    expect(findAllSpy).toHaveBeenCalled();
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

    const result = await useCases.findRecommended(profile, [3]);

    expect(result).toEqual(recommended);
    expect(findRecommendedSpy).toHaveBeenCalledWith(profile, [3]);
  });
});
