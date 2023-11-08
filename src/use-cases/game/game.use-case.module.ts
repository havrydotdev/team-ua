import { Module } from '@nestjs/common';
import { GameModule } from 'src/services/game/game.module';

import { GameUseCases } from './game.use-case';

@Module({
  exports: [GameUseCases],
  imports: [GameModule],
  providers: [GameUseCases],
})
export class GameUseCasesModule {}
