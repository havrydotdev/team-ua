import { Game } from '../entities';

abstract class IGameService {
  abstract findAll(): Promise<Game[]>;
}

export { IGameService };
