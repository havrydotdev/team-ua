import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { GameUseCases } from '../game.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmGameService } from 'src/frameworks/game/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/core';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';

describe('GameUseCases', () => {
  let gameUseCases: GameUseCases;
  let gameService: IGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([Game])],
      providers: [
        GameUseCases,
        {
          provide: IGameService,
          useClass: TypeOrmGameService,
        },
      ],
    }).compile();

    gameService = module.get<IGameService>(IGameService);
    gameUseCases = module.get<GameUseCases>(GameUseCases);
  });

  describe('findAll', () => {
    it('should call gameService.findAll and return its result', async () => {
      const games = [
        Game.create({ id: 1, title: 'Game 1' }),
        Game.create({ id: 2, title: 'Game 2' }),
      ];

      jest
        .spyOn(gameService, 'findAll')
        .mockImplementationOnce(async () => games);

      const result = await gameUseCases.findAll();

      expect(gameService.findAll).toBeCalledTimes(1);
      expect(result).toEqual(games);
    });
  });
});
