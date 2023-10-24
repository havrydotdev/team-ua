import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Game } from 'src/core/entities';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { GameUseCases } from '../game.use-case';

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
          useValue: createMock<IGameService>(),
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

      const findAllSpy = jest
        .spyOn(gameService, 'findAll')
        .mockImplementationOnce(async () => games);

      const result = await gameUseCases.findAll();

      expect(findAllSpy).toBeCalledTimes(1);
      expect(result).toEqual(games);
    });
  });
});
