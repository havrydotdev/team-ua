import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmGameService } from '../typeorm-game.service';
import { Game } from 'src/core';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';

describe('TypeOrmGameService', () => {
  let service: TypeOrmGameService;
  let repo: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([Game])],
      providers: [TypeOrmGameService],
    }).compile();

    service = module.get<TypeOrmGameService>(TypeOrmGameService);
    repo = module.get<Repository<Game>>(Repository<Game>);
  });

  it('should return an array of games', async () => {
    const games = [
      Game.create({
        title: 'Test Game 1',
      }),
      Game.create({
        title: 'Test Game 2',
      }),
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(games);

    const result = await service.findAll();

    expect(result).toEqual(games);
  });
});
