import { Game } from '../entities';

abstract class IGameService {
  abstract findAll(): Promise<Game[]>;

  abstract findWithLimit(limit: number): Promise<Game[]>;

  abstract findStartsWith(title: string): Promise<Game[]>;

  abstract findByTitle(title: string): Promise<Game | null>;
}

export { IGameService };
