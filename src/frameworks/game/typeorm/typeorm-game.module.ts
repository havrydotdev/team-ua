import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Game } from 'src/core/entities';

import { TypeOrmGameService } from './typeorm-game.service';

@Module({
  exports: [IGameService],
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [
    {
      provide: IGameService,
      useClass: TypeOrmGameService,
    },
  ],
})
export class TypeOrmGameModule {}
