import { Injectable } from '@nestjs/common';
import { IGameService } from 'src/core/abstracts';

@Injectable()
export class GameUseCases {
  constructor(private readonly gameService: IGameService) {}

  async findAll() {
    return this.gameService.findAll();
  }
}
