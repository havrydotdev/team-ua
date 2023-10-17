import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/core';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmGameService implements IGameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepo.find();
  }
}
