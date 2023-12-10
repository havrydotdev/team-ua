import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from 'src/core/entities';
import { Repository } from 'typeorm';

import { TypeOrmProfileService } from '../typeorm-profile.service';

describe('TypeOrmProfileService', () => {
  let service: TypeOrmProfileService;
  let repo: jest.Mocked<Repository<Profile>>;

  beforeEach(async () => {
    const repoToken = getRepositoryToken(Profile);
    const { unit, unitRef } = TestBed.create(TypeOrmProfileService).compile();

    service = unit;
    repo = unitRef.get(repoToken as string);
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

    jest.spyOn(repo, 'save').mockResolvedValue(
      createMock<Profile>({
        id: 2,
      }),
    );

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
    const profile = createMock<Profile>({
      id: 3,
    });

    const findSpy = jest.spyOn(service, 'findById').mockResolvedValue(profile);

    const deleteSpy = jest.spyOn(repo, 'remove').mockResolvedValue(undefined);

    await service.delete(profile.id);

    expect(findSpy).toHaveBeenCalledWith(profile.id);
    expect(deleteSpy).toHaveBeenCalledWith(profile);
  });
});
