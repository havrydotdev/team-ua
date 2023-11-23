import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from 'src/core/entities';
import { Repository } from 'typeorm';

import { TypeOrmGameService } from '../typeorm-game.service';

describe('TypeOrmGameService', () => {
  let service: TypeOrmGameService;
  let repo: Repository<Game>;

  beforeEach(async () => {
    const repoToken = getRepositoryToken(Game);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmGameService,
        {
          provide: repoToken,
          useValue: createMock<Repository<Game>>(),
        },
      ],
    }).compile();

    service = module.get<TypeOrmGameService>(TypeOrmGameService);
    repo = module.get<Repository<Game>>(getRepositoryToken(Game));
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
