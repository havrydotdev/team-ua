import { Injectable } from '@nestjs/common';
import { IGameService } from 'src/core/abstracts';

@Injectable()
export class GameUseCases {
  constructor(private readonly gameService: IGameService) {}

  async findAll() {
    return this.gameService.findAll();
  }

  async findStartsWith(title: string) {
    return this.gameService.findStartsWith(title);
  }

  async findByTitle(title: string) {
    return this.gameService.findByTitle(title);
  }
}
