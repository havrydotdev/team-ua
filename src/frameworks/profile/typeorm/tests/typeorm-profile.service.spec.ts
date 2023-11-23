import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from 'src/core/entities';
import { InsertResult, Repository } from 'typeorm';

import { TypeOrmProfileService } from '../typeorm-profile.service';

describe('TypeOrmProfileService', () => {
  let service: TypeOrmProfileService;
  let repo: Repository<Profile>;

  beforeEach(async () => {
    const repoToken = getRepositoryToken(Profile);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmProfileService,
        {
          provide: repoToken,
          useValue: createMock<Repository<Profile>>(),
        },
      ],
    }).compile();

    service = module.get<TypeOrmProfileService>(TypeOrmProfileService);
    repo = module.get<Repository<Profile>>(repoToken);
  });

  it('should return a profile for a given user ID', async () => {
    const userId = 1;
    const profile = createMock<Profile>();
    jest.spyOn(repo, 'findOne').mockResolvedValue(profile);

    const result = await service.findByUser(userId);

    expect(result).toEqual(profile);
    expect(repo.findOne).toHaveBeenCalledWith({
      relations: {
        games: true,
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
  });

  it('should create a profile', async () => {
    const profile = createMock<Profile>();

    jest.spyOn(repo, 'insert').mockResolvedValue({
      identifiers: [{ id: 1 }],
    } as unknown as InsertResult);

    jest.spyOn(repo, 'findOne').mockResolvedValue(profile);

    const result = await service.createProfile(profile);

    expect(result).toEqual(profile);
    expect(repo.save).toHaveBeenCalledWith(profile);
  });

  it('should update a profile', async () => {
    const profileId = 1;
    const profile = createMock<Profile>();
    jest.spyOn(repo, 'save').mockResolvedValue(profile);

    const result = await service.updateProfile(profileId, profile);

    expect(result).toEqual(profile);
    expect(repo.save).toHaveBeenCalledWith({
      id: profileId,
      ...profile,
    });
  });

  it('should delete a profile', async () => {
    const profileId = 1;

    const deleteSpy = jest.spyOn(repo, 'remove').mockResolvedValue(undefined);

    await service.delete(profileId);

    expect(deleteSpy).toHaveBeenCalledWith(profileId);
  });
});
