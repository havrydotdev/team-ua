import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GameUseCases } from 'src/use-cases/game';

import { BotException } from '../errors';

@Injectable()
export class GamePipe implements PipeTransform {
  constructor(private readonly gameUseCases: GameUseCases) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.text === '✅') {
      return value;
    }

    const game = await this.gameUseCases.findByTitle(value.text);
    if (!game) {
      throw new BotException('messages.game.invalid');
    }

    return {
      ...value,
      gameId: game.id,
    };
  }
}
