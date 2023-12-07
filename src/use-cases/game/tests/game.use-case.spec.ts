import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Game } from 'src/core/entities';

import { GameUseCases } from '../game.use-case';

describe('GameUseCases', () => {
  let gameUseCases: GameUseCases;
  let gameService: IGameService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(GameUseCases).compile();

    gameUseCases = unit;
    // @ts-expect-error - abstract class
    gameService = unitRef.get(IGameService);
  });

  describe('findAll', () => {
    it('should call gameService.findAll and return its result', async () => {
      const games = [
        createMock<Game>({ id: 1, title: 'Game 1' }),
        createMock<Game>({ id: 2, title: 'Game 2' }),
      ];

      const findAllSpy = jest
        .spyOn(gameService, 'findAll')
        .mockImplementationOnce(async () => games);

      const result = await gameUseCases.findAll();

      expect(findAllSpy).toBeCalledTimes(1);
      expect(result).toEqual(games);
    });
  });

  describe('findStartsWith', () => {
    it('should call gameService.findStartsWith and return its result', async () => {
      const games = [
        createMock<Game>({ id: 1, title: 'Game 1' }),
        createMock<Game>({ id: 2, title: 'Game 2' }),
      ];
      const title = 'Game';

      const findStartsWithSpy = jest
        .spyOn(gameService, 'findStartsWith')
        .mockImplementationOnce(async () => games);

      const result = await gameUseCases.findStartsWith(title);

      expect(findStartsWithSpy).toBeCalledTimes(1);
      expect(findStartsWithSpy).toBeCalledWith(title);
      expect(result).toEqual(games);
    });
  });

  describe('findByTitle', () => {
    it('should call gameService.findByTitle and return its result', async () => {
      const game = createMock<Game>({ id: 1, title: 'Game 1' });
      const title = 'Game 1';

      const findByTitleSpy = jest
        .spyOn(gameService, 'findByTitle')
        .mockImplementationOnce(async () => game);

      const result = await gameUseCases.findByTitle(title);

      expect(findByTitleSpy).toBeCalledTimes(1);
      expect(findByTitleSpy).toBeCalledWith(title);
      expect(result).toEqual(game);
    });
  });
});
