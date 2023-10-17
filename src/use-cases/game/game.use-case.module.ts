import { Module } from '@nestjs/common';
import { GameModule } from 'src/services/game/game.module';
import { GameUseCases } from './game.use-case';

@Module({
  imports: [GameModule],
  providers: [GameUseCases],
  exports: [GameUseCases],
})
export class GameUseCasesModule {}
