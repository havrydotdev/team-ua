import {
  ArgumentMetadata,
  Inject,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { GameUseCases } from 'src/use-cases/game';

import { BotException } from '../errors';
import { memoize } from '../utils';

type GameExistPipeOptions = {
  allow: string[];
};

const createGamePipe = (options: GameExistPipeOptions): Type<PipeTransform> => {
  class MixinGamePipe implements PipeTransform {
    constructor(
      @Inject(GameUseCases) private readonly gameUseCases: GameUseCases,
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transform(value: any, metadata: ArgumentMetadata) {
      if (options.allow.includes(value.text)) {
        return {
          ...value,
          keyword: true,
        };
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

  return mixin(MixinGamePipe);
};

export const GameExistPipe: (
  options: GameExistPipeOptions,
) => Type<PipeTransform> = memoize(createGamePipe);
