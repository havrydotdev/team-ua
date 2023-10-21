import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUseCases } from '../profile.use-case';
import { IProfileService, CreateProfileDto, Profile } from 'src/core';
import { ProfileFactoryService } from '../profile-factory.service';

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
          useValue: {
            findByUser: jest.fn(),
            createProfile: jest.fn(),
            updateProfile: jest.fn(),
            deleteProfile: jest.fn(),
            findRecommended: jest.fn(),
          },
        },
        {
          provide: ProfileFactoryService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    useCases = module.get<ProfileUseCases>(ProfileUseCases);
    service = module.get<IProfileService>(IProfileService);
    factory = module.get<ProfileFactoryService>(ProfileFactoryService);
  });

  it('should call findByUser on the profile service', async () => {
    const userId = 1;
    const profile = new Profile();
    jest.spyOn(service, 'findByUser').mockResolvedValue(profile);

    const result = await useCases.findByUser(userId);

    expect(result).toEqual(profile);
    expect(service.findByUser).toHaveBeenCalledWith(userId);
  });

  it('should call createProfile on the profile service with a new profile', async () => {
    const dto = new CreateProfileDto();
    const profile = new Profile();
    jest.spyOn(factory, 'create').mockReturnValue(profile);
    jest.spyOn(service, 'createProfile').mockResolvedValue(profile);

    const result = await useCases.create(dto);

    expect(result).toEqual(profile);
    expect(factory.create).toHaveBeenCalledWith(dto);
    expect(service.createProfile).toHaveBeenCalledWith(profile);
  });

  it('should call updateProfile on the profile service with an updated profile', async () => {
    const profileId = 1;
    const dto = new CreateProfileDto();
    const profile = new Profile();
    jest.spyOn(factory, 'update').mockReturnValue(profile);
    jest.spyOn(service, 'updateProfile').mockResolvedValue(profile);

    const result = await useCases.updateProfile(profileId, dto);

    expect(result).toEqual(profile);
    expect(factory.update).toHaveBeenCalledWith(dto);
    expect(service.updateProfile).toHaveBeenCalledWith(profileId, profile);
  });

  it('should call deleteProfile on the profile service', async () => {
    const profileId = 1;
    jest.spyOn(service, 'deleteProfile').mockResolvedValue(undefined);

    await useCases.deleteProfile(profileId);

    expect(service.deleteProfile).toHaveBeenCalledWith(profileId);
  });

  it('should call findByUser and findRecommended on the profile service', async () => {
    const userId = 1;
    const skip = 0;
    const profile = new Profile();
    const recommended = new Profile();
    jest.spyOn(service, 'findByUser').mockResolvedValue(profile);
    jest.spyOn(service, 'findRecommended').mockResolvedValue(recommended);

    const result = await useCases.findRecommended(userId, skip);

    expect(result).toEqual(recommended);
    expect(service.findByUser).toHaveBeenCalledWith(userId);
    expect(service.findRecommended).toHaveBeenCalledWith(profile, skip);
  });
});
