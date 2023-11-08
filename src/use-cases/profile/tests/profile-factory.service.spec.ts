import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileDto } from 'src/core/dtos';
import { Game, Profile } from 'src/core/entities';

import { ProfileFactoryService } from '../profile-factory.service';

jest.spyOn(Game, 'create').mockImplementation((dto) => dto as Game);

jest.spyOn(Profile, 'create').mockImplementation((dto) => dto as Profile);

describe('UserFactoryService', () => {
  let service: ProfileFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileFactoryService],
    }).compile();

    service = module.get<ProfileFactoryService>(ProfileFactoryService);
  });

  describe('create', () => {
    it('should create a new user with the provided data', () => {
      const dto = createMock<CreateProfileDto>({
        games: [1, 2, 3],
        userId: 12345,
      });
      const createdProfile = {
        ...dto,
        file: {
          id: dto.fileId,
        },
        games: dto.games.map((gameId) => Game.create({ id: gameId })),
        user: {
          id: dto.userId,
        },
      };

      const result = service.create(dto);

      expect(result).toEqual(createdProfile);
    });
  });

  describe('update', () => {
    it('should update a user with the provided data', () => {
      const dto = createMock<CreateProfileDto>({
        games: [1, 2, 3],
        userId: 12345,
      });
      const createdProfile = {
        ...dto,
        file: {
          id: dto.fileId,
        },
        games: dto.games.map((gameId) => Game.create({ id: gameId })),
        user: {
          id: dto.userId,
        },
      };

      const result = service.update(dto);

      expect(result).toEqual(createdProfile);
    });
  });
});
