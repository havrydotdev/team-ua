import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from 'src/core/entities';
import { Repository } from 'typeorm';

import { TypeOrmGameService } from '../typeorm-game.service';

describe('TypeOrmGameService', () => {
  let service: TypeOrmGameService;
  let repo: jest.Mocked<Repository<Game>>;

  beforeEach(async () => {
    const repoToken = getRepositoryToken(Game);
    const { unit, unitRef } = TestBed.create(TypeOrmGameService).compile();

    service = unit;
    repo = unitRef.get(repoToken as string);
  });

  it('should return an array of games', async () => {
    const games = [
      createMock<Game>({
        title: 'Test Game 1',
      }),
      createMock<Game>({
        title: 'Test Game 2',
      }),
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(games);

    const result = await service.findAll();

    expect(result).toEqual(games);
  });
});
